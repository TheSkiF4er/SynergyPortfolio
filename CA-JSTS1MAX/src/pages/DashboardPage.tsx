import { useMemo, useState } from 'react';
import StatsChart from '../components/StatsChart';
import TaskCard from '../components/TaskCard';
import { useAppContext } from '../context/AppContext';
import {
  formatDateRange,
  formatDateTime,
  formatEstimate,
  getBlockedLoadHours,
  getBlockedTasks,
  getCategorySummary,
  getDependencyHotspots,
  getDependencyRiskTasks,
  getDependencySummary,
  getFocusTasks,
  getHealthLabel,
  getHealthScore,
  getPrioritySummary,
  getProgressPercent,
  getRecentActivity,
  getRecentTasks,
  getRiskTasks,
  getSprintRemainingHours,
  getStaleTasks,
  getStatusSummary,
  getTaskLoadByMember,
  getUtilizationPercent,
  getWipAlerts,
  priorityLabels,
  categoryLabels
} from '../utils/helpers';
import { TaskCategory, TaskPriority } from '../utils/types';

const DashboardPage = () => {
  const { members, sprint, tasks, activityLog } = useAppContext();
  const [activeTab, setActiveTab] = useState<'product' | 'backlog'>('product');
  const [selectedMemberId, setSelectedMemberId] = useState<'all' | string>('all');
  const [selectedPriority, setSelectedPriority] = useState<'all' | TaskPriority>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | TaskCategory>('all');
  const [showBlockedOnly, setShowBlockedOnly] = useState(false);
  const [showDependencyOnly, setShowDependencyOnly] = useState(false);
  const [search, setSearch] = useState('');

  const dependencyRiskTasks = useMemo(() => getDependencyRiskTasks(tasks), [tasks]);
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const byTab = activeTab === 'product' ? task.status !== 'backlog' : task.status === 'backlog';
      const byMember = selectedMemberId === 'all' ? true : task.assigneeId === selectedMemberId;
      const byPriority = selectedPriority === 'all' ? true : task.priority === selectedPriority;
      const byCategory = selectedCategory === 'all' ? true : task.category === selectedCategory;
      const byBlocked = showBlockedOnly ? task.blocked : true;
      const byDependency = showDependencyOnly ? dependencyRiskTasks.some((item) => item.id === task.id) : true;
      const query = `${task.id} ${task.title} ${task.subtitle} ${task.description} ${task.blockerReason || ''}`.toLowerCase();
      const bySearch = search.trim() ? query.includes(search.trim().toLowerCase()) : true;
      return byTab && byMember && byPriority && byCategory && byBlocked && byDependency && bySearch;
    });
  }, [activeTab, dependencyRiskTasks, search, selectedCategory, selectedMemberId, selectedPriority, showBlockedOnly, showDependencyOnly, tasks]);

  const completedCount = tasks.filter((task) => task.status === 'done').length;
  const totalCount = tasks.length;
  const progress = getProgressPercent(completedCount, totalCount);
  const remainingHours = getSprintRemainingHours(sprint, tasks);
  const chartData = getTaskLoadByMember(tasks, members);
  const blockedTasks = getBlockedTasks(tasks);
  const blockedHours = getBlockedLoadHours(tasks);
  const overloadedMembers = chartData.filter((item) => item.value > 16);
  const utilization = getUtilizationPercent(sprint, tasks);
  const wipAlerts = getWipAlerts(tasks, members);
  const recentActivity = getRecentActivity(activityLog, 6);
  const recentTasks = getRecentTasks(tasks, 4);
  const staleTasks = getStaleTasks(tasks, 3);
  const healthScore = getHealthScore(sprint, tasks, members);
  const focusTasks = getFocusTasks(tasks);
  const riskTasks = getRiskTasks(tasks);
  const prioritySummary = getPrioritySummary(tasks);
  const categorySummary = getCategorySummary(tasks);
  const statusSummary = getStatusSummary(tasks);
  const dependencySummary = getDependencySummary(tasks);
  const dependencyHotspots = getDependencyHotspots(tasks);
  const criticalOpen = tasks.filter((task) => task.priority === 'critical' && task.status !== 'done').length;
  const riskNote = overloadedMembers.length
    ? `Повышенная нагрузка у ${overloadedMembers.map((item) => item.label).join(', ')}.`
    : 'Критической перегрузки по текущей оценке нет.';

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">Executive overview</p>
          <h2>Обзор продукта и исполнения</h2>
        </div>
        {sprint ? (
          <div className="sprint-badge">
            <strong>{sprint.name}</strong>
            <span>{formatDateRange(sprint.startDate, sprint.endDate)}</span>
          </div>
        ) : null}
      </div>

      <div className="cards-grid cards-grid-4">
        <article className="info-card"><span>Выполнено задач</span><strong>{completedCount} / {totalCount}</strong></article>
        <article className="info-card"><span>Прогресс спринта</span><strong>{progress}%</strong><div className="progress-bar"><div style={{ width: `${progress}%` }} /></div></article>
        <article className="info-card compact risk-card"><span>Delivery health</span><strong>{healthScore}/100</strong><span className="field-hint">{getHealthLabel(healthScore)}</span></article>
        <article className="info-card"><span>Осталось времени</span><strong>{formatEstimate(Math.max(remainingHours, 0))}</strong></article>
      </div>

      <div className="cards-grid cards-grid-3 mb-24">
        <article className="info-card compact"><span>Утилизация ёмкости</span><strong>{utilization}%</strong><span className="field-hint">Показывает, сколько времени спринта уже зарезервировано задачами.</span></article>
        <article className="info-card compact"><span>Сигналы WIP</span><strong>{wipAlerts.length}</strong><span className="field-hint">Участники, у которых более одной задачи одновременно в статусе «В работе».</span></article>
        <article className="info-card compact"><span>Критические задачи</span><strong>{criticalOpen}</strong><span className="field-hint">Незавершённые задачи с максимальным приоритетом.</span></article>
        <article className="info-card compact risk-card"><span>Blocked tasks</span><strong>{blockedTasks.length}</strong><span className="field-hint">На блокерах сейчас заморожено {formatEstimate(blockedHours)} delivery-ёмкости.</span></article>
        <article className="info-card compact risk-card"><span>Dependency risk</span><strong>{dependencyRiskTasks.length}</strong><span className="field-hint">Задачи, которые ждут завершения других карточек.</span></article>
        <article className="info-card compact risk-card"><span>Операционный сигнал</span><strong>{overloadedMembers.length ? 'Нужна балансировка' : 'План стабилен'}</strong><span className="field-hint">{riskNote}</span></article>
      </div>

      <div className="cards-grid cards-grid-2 mb-24">
        <div className="panel"><h3>Статусы задач</h3><StatsChart items={statusSummary} /></div>
        <div className="panel"><h3>Распределение приоритетов</h3><StatsChart items={prioritySummary} /></div>
        <div className="panel"><h3>Распределение по категориям</h3><StatsChart items={categorySummary} /></div>
        <div className="panel"><h3>Контур зависимостей</h3><StatsChart items={dependencySummary} /></div>
      </div>

      <div className="cards-grid cards-grid-2 mb-24">
        <div className="panel"><h3>Текущая загрузка команды</h3><StatsChart items={chartData} metricLabel="ч" /></div>
        <div className="panel">
          <h3>Горячие точки зависимостей</h3>
          <div className="summary-list">
            {dependencyHotspots.length ? dependencyHotspots.map((item) => (
              <div key={item.task.id} className="summary-item">
                <div>
                  <strong>{item.task.id} — {item.task.title}</strong>
                  <div className="field-hint">{priorityLabels[item.task.priority]} • {categoryLabels[item.task.category]}</div>
                </div>
                <strong>{item.blockedCount} завис.</strong>
              </div>
            )) : <p className="empty-state">Зависимости не образуют явных узких мест.</p>}
          </div>
        </div>
      </div>

      <div className="cards-grid cards-grid-2 mb-24">
        <div className="panel">
          <h3>Что требует внимания</h3>
          <div className="insight-list">
            <article className="insight-card"><strong>Capacity</strong><p>{remainingHours >= 0 ? `В спринте остаётся ${formatEstimate(remainingHours)} доступной ёмкости.` : 'План спринта уже перегружен относительно доступной ёмкости.'}</p></article>
            <article className="insight-card"><strong>Work in progress</strong><p>{wipAlerts.length ? wipAlerts.map((item) => `${item.member.fullName}: ${item.activeTasks.length} активные задачи`).join('; ') : 'У команды нет WIP-конфликтов по текущим данным.'}</p></article>
            <article className="insight-card"><strong>Blockers</strong><p>{blockedTasks.length ? `Остановлены: ${blockedTasks.slice(0, 3).map((task) => task.id).join(', ')}.` : 'Сейчас нет задач с активными блокерами.'}</p></article>
            <article className="insight-card"><strong>Dependencies</strong><p>{dependencyRiskTasks.length ? `${dependencyRiskTasks.length} задач ждут другие карточки и могут не уложиться в спринт.` : 'Открытых dependency-risks по активным задачам нет.'}</p></article>
          </div>
        </div>
        <div className="panel">
          <h3>Последняя активность</h3>
          <div className="activity-list">
            {recentActivity.map((event) => (
              <article key={event.id} className="activity-card">
                <div className="activity-card-top"><strong>{event.title}</strong><span>{formatDateTime(event.createdAt)}</span></div>
                <p>{event.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="cards-grid cards-grid-2 mb-24">
        <div className="panel"><h3>Фокус-очередь</h3><div className="stack-list">{focusTasks.length > 0 ? focusTasks.map((task) => <TaskCard key={task.id} task={task} />) : <p>Критичных задач для немедленного внимания не обнаружено.</p>}</div></div>
        <div className="panel"><h3>Risk center</h3><div className="stack-list">{riskTasks.length ? riskTasks.map((task) => <TaskCard key={task.id} task={task} />) : <p>Сигналов риска сейчас нет.</p>}</div></div>
      </div>

      <div className="panel">
        <div className="page-header compact">
          <div>
            <h3>Операционный реестр</h3>
            <p className="field-hint">Можно быстро сузить список до blocked или dependency-risk карточек и проверить их контекст.</p>
          </div>
          <div className="toolbar-actions">
            <input className="search-input" placeholder="Поиск по ID, названию или блокеру" value={search} onChange={(event) => setSearch(event.target.value)} />
            <button type="button" className={activeTab === 'product' ? 'tab active' : 'tab'} onClick={() => setActiveTab('product')}>Product</button>
            <button type="button" className={activeTab === 'backlog' ? 'tab active' : 'tab'} onClick={() => setActiveTab('backlog')}>Backlog</button>
          </div>
        </div>

        <div className="member-filter mb-24">
          <button type="button" className={selectedMemberId === 'all' ? 'chip active' : 'chip'} onClick={() => setSelectedMemberId('all')}>Все участники</button>
          {members.map((member) => <button type="button" key={member.id} className={selectedMemberId === member.id ? 'chip active' : 'chip'} onClick={() => setSelectedMemberId(member.id)}>{member.fullName}</button>)}
        </div>
        <div className="member-filter mb-24">
          <button type="button" className={selectedPriority === 'all' ? 'chip active' : 'chip'} onClick={() => setSelectedPriority('all')}>Все приоритеты</button>
          {(['low', 'medium', 'high', 'critical'] as TaskPriority[]).map((priority) => <button type="button" key={priority} className={selectedPriority === priority ? 'chip active' : 'chip'} onClick={() => setSelectedPriority(priority)}>{priorityLabels[priority]}</button>)}
        </div>
        <div className="member-filter mb-24">
          <button type="button" className={selectedCategory === 'all' ? 'chip active' : 'chip'} onClick={() => setSelectedCategory('all')}>Все категории</button>
          {(['feature', 'bug', 'techDebt', 'research', 'operations'] as TaskCategory[]).map((category) => <button type="button" key={category} className={selectedCategory === category ? 'chip active' : 'chip'} onClick={() => setSelectedCategory(category)}>{categoryLabels[category]}</button>)}
        </div>
        <div className="member-filter mb-24">
          <button type="button" className={showBlockedOnly ? 'chip active' : 'chip'} onClick={() => setShowBlockedOnly((current) => !current)}>{showBlockedOnly ? 'Показывать всё' : 'Только blocked'}</button>
          <button type="button" className={showDependencyOnly ? 'chip active' : 'chip'} onClick={() => setShowDependencyOnly((current) => !current)}>{showDependencyOnly ? 'Показывать всё' : 'Только dependency risk'}</button>
        </div>

        <div className="cards-grid cards-grid-2">
          {filteredTasks.length ? filteredTasks.map((task) => <TaskCard key={task.id} task={task} />) : <p className="empty-state">По текущим фильтрам карточек не найдено.</p>}
        </div>
      </div>

      <div className="cards-grid cards-grid-2 mt-24">
        <div className="panel"><h3>Blocked now</h3><div className="stack-list">{blockedTasks.length ? blockedTasks.map((task) => <TaskCard key={task.id} task={task} />) : <p>Активных блокеров сейчас нет.</p>}</div></div>
        <div className="panel"><h3>Последние обновления задач</h3><div className="stack-list">{recentTasks.length ? recentTasks.map((task) => <TaskCard key={task.id} task={task} />) : <p>Новых или недавно обновлённых задач пока нет.</p>}</div></div>
      </div>

      {staleTasks.length ? <div className="notice notice-info mt-24">Внимание: {staleTasks.length} задач не обновлялись более трёх дней.</div> : null}
    </section>
  );
};

export default DashboardPage;
