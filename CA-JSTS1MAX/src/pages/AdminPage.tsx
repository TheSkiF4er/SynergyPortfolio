import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import FormField from '../components/FormField';
import MultiSelectChips from '../components/MultiSelectChips';
import SelectField from '../components/SelectField';
import TaskCard from '../components/TaskCard';
import { useAppContext } from '../context/AppContext';
import {
  calculateSprintDuration,
  categoryLabels,
  formatEstimate,
  generateTaskId,
  getBlockedTasks,
  getDependencyHotspots,
  getDependencyRiskTasks,
  getMemberCapacityView,
  getSprintRemainingHours,
  priorityLabels,
  sortTasks,
  statusLabels
} from '../utils/helpers';
import { Sprint, Task, TaskCategory, TaskPriority, TaskStatus, TeamMember } from '../utils/types';

const emptySprint: Sprint = {
  id: 'sprint-new',
  name: '',
  goal: '',
  durationDays: 0,
  startDate: '',
  endDate: ''
};

const createEmptyTaskForm = (members: TeamMember[]) => ({
  title: '',
  subtitle: '',
  authorId: members[0]?.id || '',
  assigneeId: members[0]?.id || '',
  estimateHours: 1,
  description: '',
  comments: '',
  watchers: [] as string[],
  blockedByTaskIds: [] as string[],
  status: 'todo' as TaskStatus,
  priority: 'medium' as TaskPriority,
  category: 'feature' as TaskCategory,
  blocked: false,
  blockerReason: ''
});

const AdminPage = () => {
  const { members, sprint, tasks, addMember, saveSprint, addTask, updateTask, deleteTask, resetDemoData, exportData, importData } = useAppContext();

  const [memberForm, setMemberForm] = useState({ fullName: '', position: '', department: '' });
  const [sprintForm, setSprintForm] = useState<Sprint>(sprint || emptySprint);
  const [taskForm, setTaskForm] = useState(createEmptyTaskForm(members));
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isImporting, setIsImporting] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [registrySearch, setRegistrySearch] = useState('');
  const [registryPriority, setRegistryPriority] = useState<'all' | TaskPriority>('all');
  const [registryCategory, setRegistryCategory] = useState<'all' | TaskCategory>('all');
  const [registryBlocked, setRegistryBlocked] = useState<'all' | 'blocked'>('all');
  const [registryDependency, setRegistryDependency] = useState<'all' | 'dependency'>('all');

  useEffect(() => {
    if (!taskForm.authorId && members[0]?.id) {
      setTaskForm((current) => ({ ...current, authorId: members[0].id, assigneeId: current.assigneeId || members[0].id }));
    }
  }, [members, taskForm.authorId]);

  useEffect(() => {
    setSprintForm(sprint || emptySprint);
  }, [sprint]);

  const remainingHours = useMemo(() => getSprintRemainingHours(sprint, tasks), [sprint, tasks]);
  const estimate = Number(taskForm.estimateHours || 0);
  const currentEditedTask = tasks.find((task) => task.id === editingTaskId) || null;
  const projectedRemainingHours = remainingHours - estimate + (currentEditedTask?.estimateHours || 0);
  const memberOptions = [{ value: '', label: 'Выберите участника' }, ...members.map((member) => ({ value: member.id, label: member.fullName }))];
  const watcherOptions = members.map((member) => ({ value: member.id, label: member.fullName }));
  const dependencyOptions = tasks
    .filter((task) => task.id !== editingTaskId)
    .map((task) => ({ value: task.id, label: `${task.id} — ${task.title}` }));
  const statusOptions = (Object.keys(statusLabels) as TaskStatus[]).map((status) => ({ value: status, label: statusLabels[status] }));
  const priorityOptions = (Object.keys(priorityLabels) as TaskPriority[]).map((priority) => ({ value: priority, label: priorityLabels[priority] }));
  const categoryOptions = (Object.keys(categoryLabels) as TaskCategory[]).map((category) => ({ value: category, label: categoryLabels[category] }));
  const dependencyRiskTasks = useMemo(() => getDependencyRiskTasks(tasks), [tasks]);
  const dependencyHotspots = useMemo(() => getDependencyHotspots(tasks), [tasks]);
  const registryTasks = useMemo(() => {
    const query = registrySearch.trim().toLowerCase();
    return sortTasks(
      tasks.filter((task) => {
        const matchesQuery = !query ? true : `${task.id} ${task.title} ${task.subtitle} ${task.blockerReason || ''}`.toLowerCase().includes(query);
        const matchesPriority = registryPriority === 'all' ? true : task.priority === registryPriority;
        const matchesCategory = registryCategory === 'all' ? true : task.category === registryCategory;
        const matchesBlocked = registryBlocked === 'all' ? true : task.blocked;
        const matchesDependency = registryDependency === 'all' ? true : dependencyRiskTasks.some((item) => item.id === task.id);
        return matchesQuery && matchesPriority && matchesCategory && matchesBlocked && matchesDependency;
      }),
      'priority'
    );
  }, [dependencyRiskTasks, registryBlocked, registryCategory, registryDependency, registryPriority, registrySearch, tasks]);
  const capacityView = useMemo(() => getMemberCapacityView(tasks, members), [tasks, members]);
  const blockedTasks = useMemo(() => getBlockedTasks(tasks), [tasks]);

  const patchErrors = (nextErrors: Record<string, string>) => {
    setErrors((current) => ({ ...current, ...nextErrors }));
  };

  const clearMessage = () => setMessage('');
  const resetTaskForm = () => {
    setEditingTaskId(null);
    setTaskForm(createEmptyTaskForm(members));
  };

  const saveMemberHandler = (event: FormEvent) => {
    event.preventDefault();
    clearMessage();
    const nextErrors: Record<string, string> = {
      memberFullName: '',
      memberPosition: '',
      memberDepartment: ''
    };

    if (memberForm.fullName.trim().length < 5) nextErrors.memberFullName = 'Укажите ФИО полностью';
    if (!memberForm.position.trim()) nextErrors.memberPosition = 'Укажите должность';
    if (!memberForm.department.trim()) nextErrors.memberDepartment = 'Укажите подразделение';
    if (members.some((member) => member.fullName.toLowerCase() === memberForm.fullName.trim().toLowerCase())) nextErrors.memberFullName = 'Такой участник уже существует';

    patchErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    const newMember: TeamMember = {
      id: `u-${Date.now()}`,
      fullName: memberForm.fullName.trim(),
      position: memberForm.position.trim(),
      department: memberForm.department.trim()
    };

    addMember(newMember);
    setMemberForm({ fullName: '', position: '', department: '' });
    setMessage('Участник успешно добавлен.');
  };

  const saveSprintHandler = (event: FormEvent) => {
    event.preventDefault();
    clearMessage();
    const duration = calculateSprintDuration(sprintForm.startDate, sprintForm.endDate);
    const nextErrors: Record<string, string> = {
      sprintName: '',
      sprintGoal: '',
      sprintDates: ''
    };

    if (!sprintForm.name.trim()) nextErrors.sprintName = 'Укажите имя спринта';
    if (!sprintForm.goal.trim()) nextErrors.sprintGoal = 'Укажите цель спринта';
    if (!sprintForm.startDate || !sprintForm.endDate) nextErrors.sprintDates = 'Укажите даты начала и окончания';
    if (duration <= 0) nextErrors.sprintDates = 'Дата окончания должна быть позже или равна дате начала';

    patchErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    saveSprint({ ...sprintForm, id: sprint?.id || 'sprint-1', durationDays: duration });
    setSprintForm((current) => ({ ...current, durationDays: duration }));
    setMessage('Спринт сохранён.');
  };

  const validateTask = () => {
    const nextErrors: Record<string, string> = {
      title: '',
      subtitle: '',
      authorId: '',
      assigneeId: '',
      estimateHours: '',
      description: '',
      comments: '',
      blockerReason: '',
      dependencies: '',
      sprint: ''
    };

    if (!taskForm.title.trim()) nextErrors.title = 'Укажите заголовок';
    if (!taskForm.subtitle.trim()) nextErrors.subtitle = 'Укажите подзаголовок';
    if (!taskForm.authorId) nextErrors.authorId = 'Выберите автора';
    if (!taskForm.assigneeId) nextErrors.assigneeId = 'Выберите исполнителя';
    if (!estimate || estimate <= 0) nextErrors.estimateHours = 'Укажите корректную оценку в часах';
    if (taskForm.description.trim().length < 40) nextErrors.description = 'Описание должно быть не менее 40 символов';
    if (taskForm.comments.trim() && taskForm.comments.trim().length < 40) nextErrors.comments = 'Комментарий должен быть не менее 40 символов';
    if (taskForm.blocked && taskForm.blockerReason.trim().length < 10) nextErrors.blockerReason = 'Для blocked-задачи опишите причину минимум в 10 символов';
    if (taskForm.blockedByTaskIds.includes(editingTaskId || '')) nextErrors.dependencies = 'Задача не может зависеть сама от себя';
    if (!sprint) nextErrors.sprint = 'Сначала создайте спринт';
    if (projectedRemainingHours < 0) nextErrors.estimateHours = 'На эту задачу не хватает времени в текущем спринте';

    patchErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const saveTaskHandler = (event: FormEvent) => {
    event.preventDefault();
    clearMessage();
    if (!validateTask() || !sprint) return;

    const payload = {
      title: taskForm.title.trim(),
      subtitle: taskForm.subtitle.trim(),
      authorId: taskForm.authorId,
      assigneeId: taskForm.assigneeId,
      estimateHours: estimate,
      description: taskForm.description.trim(),
      comments: taskForm.comments.trim() || undefined,
      watchers: taskForm.watchers,
      blockedByTaskIds: taskForm.blockedByTaskIds,
      status: taskForm.status,
      priority: taskForm.priority,
      category: taskForm.category,
      blocked: taskForm.blocked,
      blockerReason: taskForm.blocked ? taskForm.blockerReason.trim() : undefined
    };

    if (editingTaskId) {
      updateTask(editingTaskId, payload);
      setMessage(`Задача ${editingTaskId} обновлена.`);
      resetTaskForm();
      return;
    }

    const newTask: Task = {
      id: generateTaskId(tasks),
      ...payload,
      sprintId: sprint.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addTask(newTask);
    resetTaskForm();
    setMessage(`Задача ${newTask.id} успешно создана.`);
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    clearMessage();
    setIsImporting(true);
    const result = await importData(file);
    setMessage(result.message);
    setIsImporting(false);
    event.target.value = '';
  };

  const startEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setTaskForm({
      title: task.title,
      subtitle: task.subtitle,
      authorId: task.authorId,
      assigneeId: task.assigneeId,
      estimateHours: task.estimateHours,
      description: task.description,
      comments: task.comments || '',
      watchers: task.watchers,
      blockedByTaskIds: task.blockedByTaskIds,
      status: task.status,
      priority: task.priority,
      category: task.category,
      blocked: task.blocked,
      blockerReason: task.blockerReason || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTask = (task: Task) => {
    const shouldDelete = window.confirm(`Удалить задачу ${task.id}?`);
    if (!shouldDelete) return;
    deleteTask(task.id);
    if (editingTaskId === task.id) resetTaskForm();
    setMessage(`Задача ${task.id} удалена.`);
  };

  return (
    <section>
      <div className="page-header compact">
        <div>
          <p className="eyebrow">Operations studio</p>
          <h2>Настройка спринта, команды и задач</h2>
        </div>
        <div className="action-row">
          <button type="button" className="secondary-button" onClick={exportData}>Экспорт JSON</button>
          <label className="secondary-button upload-button">Импорт JSON<input type="file" accept="application/json" onChange={handleImport} /></label>
          <button type="button" className="secondary-button" onClick={resetDemoData}>Восстановить стартовые данные</button>
        </div>
      </div>

      {message ? <div className="notice">{message}</div> : null}
      {isImporting ? <div className="notice notice-info">Импорт данных...</div> : null}

      <div className="cards-grid cards-grid-4 mb-24">
        <article className="info-card compact"><span>Участников в системе</span><strong>{members.length}</strong></article>
        <article className="info-card compact"><span>Задач в реестре</span><strong>{tasks.length}</strong></article>
        <article className="info-card compact risk-card"><span>Blocked сейчас</span><strong>{blockedTasks.length}</strong></article>
        <article className="info-card compact risk-card"><span>Dependency risk</span><strong>{dependencyRiskTasks.length}</strong></article>
      </div>

      <div className="cards-grid cards-grid-2">
        <form className="panel" onSubmit={saveSprintHandler}>
          <h3>Параметры спринта</h3>
          <FormField label="Имя спринта" value={sprintForm.name} onChange={(e) => setSprintForm({ ...sprintForm, name: e.target.value })} error={errors.sprintName} />
          <FormField as="textarea" label="Цель спринта" value={sprintForm.goal} onChange={(e) => setSprintForm({ ...sprintForm, goal: e.target.value })} error={errors.sprintGoal} />
          <div className="inline-grid">
            <FormField label="Дата начала" type="date" value={sprintForm.startDate} onChange={(e) => setSprintForm({ ...sprintForm, startDate: e.target.value, durationDays: calculateSprintDuration(e.target.value, sprintForm.endDate) })} error={errors.sprintDates} />
            <FormField label="Дата окончания" type="date" value={sprintForm.endDate} onChange={(e) => setSprintForm({ ...sprintForm, endDate: e.target.value, durationDays: calculateSprintDuration(sprintForm.startDate, e.target.value) })} error={errors.sprintDates} />
          </div>
          <FormField label="Длительность" value={String(calculateSprintDuration(sprintForm.startDate, sprintForm.endDate) || sprintForm.durationDays || 0)} readOnly hint="Считается автоматически по датам" />
          <button className="primary-button" type="submit">Сохранить спринт</button>
        </form>

        <form className="panel" onSubmit={saveMemberHandler}>
          <h3>Новый участник команды</h3>
          <FormField label="ФИО" value={memberForm.fullName} onChange={(e) => setMemberForm({ ...memberForm, fullName: e.target.value })} error={errors.memberFullName} />
          <FormField label="Должность" value={memberForm.position} onChange={(e) => setMemberForm({ ...memberForm, position: e.target.value })} error={errors.memberPosition} />
          <FormField label="Подразделение" value={memberForm.department} onChange={(e) => setMemberForm({ ...memberForm, department: e.target.value })} error={errors.memberDepartment} />
          <button className="primary-button" type="submit">Добавить участника</button>
        </form>
      </div>

      <div className="panel mt-24">
        <div className="page-header compact">
          <div>
            <h3>Capacity view команды</h3>
            <p className="field-hint">Быстрый контроль загрузки, blocked-задач, dependency-risks и концентрации high-priority задач по каждому участнику.</p>
          </div>
        </div>
        <div className="capacity-grid">
          {capacityView.map((member) => (
            <article key={member.id} className="insight-card">
              <strong>{member.name}</strong>
              <p>{member.hours}ч активной загрузки • {member.active} задач • {member.critical} high/critical • {member.blocked} blocked • {member.dependencyRisk} ждут зависимости</p>
              <span className="field-hint">{member.utilizationLabel}</span>
            </article>
          ))}
        </div>
      </div>

      <div className="cards-grid cards-grid-2 mt-24">
        <div className="panel">
          <h3>Dependency hotspots</h3>
          <div className="summary-list">
            {dependencyHotspots.length ? dependencyHotspots.map((item) => (
              <div key={item.task.id} className="summary-item">
                <div>
                  <strong>{item.task.id} — {item.task.title}</strong>
                  <div className="field-hint">Эта карточка задерживает другие элементы потока.</div>
                </div>
                <strong>{item.blockedCount}</strong>
              </div>
            )) : <p className="empty-state">Горячих точек по зависимостям пока нет.</p>}
          </div>
        </div>
        <div className="panel">
          <h3>Свободная ёмкость</h3>
          <div className="insight-card">
            <strong>{formatEstimate(Math.max(remainingHours, 0))}</strong>
            <p>Показывает остаток доступного времени в текущем спринте с учётом уже заведённых карточек.</p>
          </div>
        </div>
      </div>

      <form className="panel mt-24" onSubmit={saveTaskHandler}>
        <div className="page-header compact">
          <div>
            <h3>{editingTaskId ? `Редактирование задачи ${editingTaskId}` : 'Новая задача продукта'}</h3>
            <p className="field-hint">ID генерируется автоматически в формате XX-1234. Можно фиксировать блокеры и зависимости между карточками.</p>
          </div>
          <div className="action-row">
            <div className="info-card compact stat-callout"><span>Останется в спринте после сохранения</span><strong>{projectedRemainingHours >= 0 ? formatEstimate(projectedRemainingHours) : 'Недостаточно времени'}</strong></div>
            {editingTaskId ? <button type="button" className="secondary-button" onClick={resetTaskForm}>Отменить редактирование</button> : null}
          </div>
        </div>

        <div className="inline-grid">
          <FormField label="Заголовок" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} error={errors.title} />
          <FormField label="Подзаголовок" value={taskForm.subtitle} onChange={(e) => setTaskForm({ ...taskForm, subtitle: e.target.value })} error={errors.subtitle} />
        </div>

        <div className="inline-grid triple">
          <SelectField label="Автор" value={taskForm.authorId} onChange={(value) => setTaskForm({ ...taskForm, authorId: value })} options={memberOptions} error={errors.authorId} />
          <SelectField label="Исполнитель" value={taskForm.assigneeId} onChange={(value) => setTaskForm({ ...taskForm, assigneeId: value })} options={memberOptions} error={errors.assigneeId} />
          <FormField label="Время выполнения, часы" type="number" min={1} value={taskForm.estimateHours} onChange={(e) => setTaskForm({ ...taskForm, estimateHours: Number(e.target.value) })} error={errors.estimateHours} hint={`Будет показано как: ${formatEstimate(estimate)}`} />
        </div>

        <div className="inline-grid triple">
          <SelectField label="Статус" value={taskForm.status} onChange={(value) => setTaskForm({ ...taskForm, status: value as TaskStatus, blocked: value === 'done' ? false : taskForm.blocked, blockerReason: value === 'done' ? '' : taskForm.blockerReason })} options={statusOptions} />
          <SelectField label="Приоритет" value={taskForm.priority} onChange={(value) => setTaskForm({ ...taskForm, priority: value as TaskPriority })} options={priorityOptions} />
          <SelectField label="Категория" value={taskForm.category} onChange={(value) => setTaskForm({ ...taskForm, category: value as TaskCategory })} options={categoryOptions} />
        </div>

        <div className="member-filter mb-24">
          <button type="button" className={taskForm.blocked ? 'chip active' : 'chip'} onClick={() => setTaskForm((current) => ({ ...current, blocked: !current.blocked, blockerReason: current.blocked ? '' : current.blockerReason }))}>
            {taskForm.blocked ? 'Снять blocked-флаг' : 'Отметить как blocked'}
          </button>
        </div>

        {taskForm.blocked ? <FormField as="textarea" label="Причина блокировки" value={taskForm.blockerReason} onChange={(e) => setTaskForm({ ...taskForm, blockerReason: e.target.value })} error={errors.blockerReason} hint="Минимум 10 символов, чтобы команда понимала, что мешает движению задачи" /> : null}
        <FormField as="textarea" label="Описание задачи" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} error={errors.description} hint="Минимум 40 символов" />
        <FormField as="textarea" label="Дополнительные комментарии" value={taskForm.comments} onChange={(e) => setTaskForm({ ...taskForm, comments: e.target.value })} error={errors.comments} hint="Если поле заполнено, то минимум 40 символов" />
        <MultiSelectChips label="Наблюдатели" options={watcherOptions} value={taskForm.watchers} onChange={(value) => setTaskForm({ ...taskForm, watchers: value })} hint="Выберите одного или нескольких наблюдателей" />
        <MultiSelectChips label="Зависимости" options={dependencyOptions} value={taskForm.blockedByTaskIds} onChange={(value) => setTaskForm({ ...taskForm, blockedByTaskIds: value })} hint="Карточки, которые должны быть завершены раньше этой задачи" />
        {errors.dependencies ? <p className="field-error">{errors.dependencies}</p> : null}

        {errors.sprint ? <p className="field-error">{errors.sprint}</p> : null}
        <button className="primary-button" type="submit">{editingTaskId ? 'Сохранить изменения' : 'Создать задачу'}</button>
      </form>

      <div className="panel mt-24">
        <div className="page-header compact">
          <div>
            <h3>Реестр задач</h3>
            <p className="field-hint">Можно быстро найти карточку, отфильтровать её по blocked/dependency/priority/category, затем открыть на редактирование или удалить.</p>
          </div>
          <div className="toolbar-actions">
            <input className="search-input" placeholder="Поиск по ID или названию" value={registrySearch} onChange={(e) => setRegistrySearch(e.target.value)} />
            <SelectField label="Приоритет" value={registryPriority} onChange={(value) => setRegistryPriority(value as 'all' | TaskPriority)} options={[{ value: 'all', label: 'Все приоритеты' }, ...priorityOptions]} compact />
            <SelectField label="Категория" value={registryCategory} onChange={(value) => setRegistryCategory(value as 'all' | TaskCategory)} options={[{ value: 'all', label: 'Все категории' }, ...categoryOptions]} compact />
            <SelectField label="Blocked" value={registryBlocked} onChange={(value) => setRegistryBlocked(value as 'all' | 'blocked')} options={[{ value: 'all', label: 'Все задачи' }, { value: 'blocked', label: 'Только blocked' }]} compact />
            <SelectField label="Dependencies" value={registryDependency} onChange={(value) => setRegistryDependency(value as 'all' | 'dependency')} options={[{ value: 'all', label: 'Все задачи' }, { value: 'dependency', label: 'Только dependency risk' }]} compact />
          </div>
        </div>
        <div className="cards-grid cards-grid-2">
          {registryTasks.length > 0 ? registryTasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={startEditTask} onDelete={handleDeleteTask} />
          )) : <p>По вашему фильтру задач не найдено.</p>}
        </div>
      </div>
    </section>
  );
};

export default AdminPage;
