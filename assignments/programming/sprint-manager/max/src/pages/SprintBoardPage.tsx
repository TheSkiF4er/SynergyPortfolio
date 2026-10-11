import { useMemo, useState } from 'react';
import SelectField from '../components/SelectField';
import TaskCard from '../components/TaskCard';
import { useAppContext } from '../context/AppContext';
import { categoryLabels, getBlockedTasks, getDependencyRiskTasks, getStaleTasks, priorityLabels, sortTasks, statusLabels } from '../utils/helpers';
import { TaskCategory, TaskPriority, TaskStatus } from '../utils/types';

const SprintBoardPage = () => {
  const { members, tasks } = useAppContext();
  const [selectedMemberId, setSelectedMemberId] = useState<'all' | string>('all');
  const [selectedPriority, setSelectedPriority] = useState<'all' | TaskPriority>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | TaskCategory>('all');
  const [showBlockedOnly, setShowBlockedOnly] = useState(false);
  const [showDependencyOnly, setShowDependencyOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [showDone, setShowDone] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'estimateDesc' | 'estimateAsc' | 'title' | 'priority' | 'recentlyUpdated'>('priority');

  const dependencyRiskTasks = useMemo(() => getDependencyRiskTasks(tasks), [tasks]);

  const visibleTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      const byDone = showDone ? true : task.status !== 'done';
      const byMember = selectedMemberId === 'all' ? true : task.assigneeId === selectedMemberId;
      const byPriority = selectedPriority === 'all' ? true : task.priority === selectedPriority;
      const byCategory = selectedCategory === 'all' ? true : task.category === selectedCategory;
      const byBlocked = showBlockedOnly ? task.blocked : true;
      const byDependency = showDependencyOnly ? dependencyRiskTasks.some((item) => item.id === task.id) : true;
      const query = `${task.id} ${task.title} ${task.subtitle} ${task.description} ${task.blockerReason || ''}`.toLowerCase();
      const bySearch = search.trim() ? query.includes(search.trim().toLowerCase()) : true;
      return byDone && byMember && byPriority && byCategory && byBlocked && byDependency && bySearch;
    });

    return sortTasks(filtered, sortBy);
  }, [dependencyRiskTasks, search, selectedCategory, selectedMemberId, selectedPriority, showBlockedOnly, showDependencyOnly, showDone, sortBy, tasks]);

  const columns: TaskStatus[] = showDone ? ['backlog', 'todo', 'inProgress', 'done'] : ['backlog', 'todo', 'inProgress'];
  const inFlowCount = tasks.filter((task) => task.status !== 'done').length;
  const blockedAssignees = members.filter((member) => tasks.filter((task) => task.assigneeId === member.id && task.status === 'inProgress').length > 1);
  const staleTasks = getStaleTasks(tasks, 3);
  const blockedTasks = getBlockedTasks(tasks);
  const criticalVisible = visibleTasks.filter((task) => task.priority === 'critical' && task.status !== 'done').length;
  const sortOptions = [
    { value: 'priority', label: 'Сначала высокий приоритет' },
    { value: 'recentlyUpdated', label: 'Сначала недавно обновлённые' },
    { value: 'newest', label: 'Сначала новые' },
    { value: 'estimateDesc', label: 'Сначала большие оценки' },
    { value: 'estimateAsc', label: 'Сначала малые оценки' },
    { value: 'title', label: 'По названию' }
  ];

  return (
    <section>
      <div className="page-header compact">
        <div>
          <p className="eyebrow">Delivery board</p>
          <h2>Поток исполнения задач</h2>
        </div>
        <input className="search-input" placeholder="Найти задачу по ID или названию" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      <div className="toolbar toolbar-soft mb-24">
        <div className="member-filter">
          <button type="button" className={selectedMemberId === 'all' ? 'chip active' : 'chip'} onClick={() => setSelectedMemberId('all')}>Все участники</button>
          {members.map((member) => (
            <button type="button" key={member.id} className={selectedMemberId === member.id ? 'chip active' : 'chip'} onClick={() => setSelectedMemberId(member.id)}>{member.fullName}</button>
          ))}
        </div>
        <div className="toolbar-actions">
          <SelectField label="Сортировка" value={sortBy} onChange={(value) => setSortBy(value as typeof sortBy)} options={sortOptions} compact />
          <button type="button" className={showDone ? 'tab active' : 'tab'} onClick={() => setShowDone((current) => !current)}>{showDone ? 'Скрыть done' : 'Показать done'}</button>
        </div>
      </div>

      <div className="member-filter mb-24">
        <button type="button" className={selectedPriority === 'all' ? 'chip active' : 'chip'} onClick={() => setSelectedPriority('all')}>Все приоритеты</button>
        {(['low', 'medium', 'high', 'critical'] as TaskPriority[]).map((priority) => (
          <button type="button" key={priority} className={selectedPriority === priority ? 'chip active' : 'chip'} onClick={() => setSelectedPriority(priority)}>{priorityLabels[priority]}</button>
        ))}
      </div>

      <div className="member-filter mb-24">
        <button type="button" className={selectedCategory === 'all' ? 'chip active' : 'chip'} onClick={() => setSelectedCategory('all')}>Все категории</button>
        {(['feature', 'bug', 'techDebt', 'research', 'operations'] as TaskCategory[]).map((category) => (
          <button type="button" key={category} className={selectedCategory === category ? 'chip active' : 'chip'} onClick={() => setSelectedCategory(category)}>{categoryLabels[category]}</button>
        ))}
      </div>

      <div className="member-filter mb-24">
        <button type="button" className={showBlockedOnly ? 'chip active' : 'chip'} onClick={() => setShowBlockedOnly((current) => !current)}>{showBlockedOnly ? 'Показывать всё' : 'Только blocked'}</button>
        <button type="button" className={showDependencyOnly ? 'chip active' : 'chip'} onClick={() => setShowDependencyOnly((current) => !current)}>{showDependencyOnly ? 'Показывать всё' : 'Только dependency risk'}</button>
      </div>

      <div className="cards-grid cards-grid-3 mb-24">
        <article className="info-card compact"><span>В потоке исполнения</span><strong>{inFlowCount}</strong></article>
        <article className="info-card compact"><span>По текущим фильтрам</span><strong>{visibleTasks.length}</strong></article>
        <article className="info-card compact"><span>Критичных в фокусе</span><strong>{criticalVisible}</strong></article>
        <article className="info-card compact risk-card"><span>Blocked сейчас</span><strong>{blockedTasks.length}</strong><span className="field-hint">Задачи с активным blocker reason, которые не двигаются дальше по потоку.</span></article>
        <article className="info-card compact risk-card"><span>Dependency risk</span><strong>{dependencyRiskTasks.length}</strong><span className="field-hint">Карточки, которые зависят от незавершённых задач.</span></article>
        <article className="info-card compact risk-card"><span>WIP сигналы</span><strong>{blockedAssignees.length || '0'}</strong><span className="field-hint">{blockedAssignees.length ? `Внимание к: ${blockedAssignees.map((member) => member.fullName).join(', ')}` : 'Конфликтов по активным задачам не обнаружено.'}</span></article>
      </div>

      <div className={showDone ? 'kanban-grid kanban-grid-wide' : 'kanban-grid'}>
        {columns.map((column) => {
          const columnTasks = visibleTasks.filter((task) => task.status === column);

          return (
            <div className="kanban-column" key={column}>
              <div className="kanban-title"><h3>{statusLabels[column]}</h3><span>{columnTasks.length}</span></div>
              <div className="stack-list">
                {columnTasks.length > 0 ? columnTasks.map((task) => <TaskCard key={task.id} task={task} showStatusActions />) : <p className="field-hint">Нет задач в колонке.</p>}
              </div>
            </div>
          );
        })}
      </div>

      {staleTasks.length ? <div className="notice notice-info mt-24">В потоке есть {staleTasks.length} карточек без обновлений более трёх дней.</div> : null}
    </section>
  );
};

export default SprintBoardPage;
