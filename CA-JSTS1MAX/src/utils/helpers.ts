import { ActivityEvent, Sprint, Task, TaskCategory, TaskPriority, TaskStatus, TeamMember } from './types';

export const statusLabels: Record<TaskStatus, string> = {
  backlog: 'Backlog',
  todo: 'К выполнению',
  inProgress: 'В работе',
  done: 'Готово'
};

export const priorityLabels: Record<TaskPriority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  critical: 'Критический'
};

export const categoryLabels: Record<TaskCategory, string> = {
  feature: 'Feature',
  bug: 'Bug',
  techDebt: 'Tech debt',
  research: 'Research',
  operations: 'Operations'
};

export const priorityWeight: Record<TaskPriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4
};

export const statusFlow: TaskStatus[] = ['backlog', 'todo', 'inProgress', 'done'];

export const calculateSprintDuration = (startDate: string, endDate: string): number => {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end.getTime() - start.getTime();

  if (Number.isNaN(diff) || diff < 0) return 0;

  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
};

export const formatEstimate = (hours: number): string => {
  const safeHours = Math.max(hours, 0);
  const days = Math.floor(safeHours / 8);
  const restHours = safeHours % 8;

  if (days === 0) return `${safeHours}ч`;
  return restHours === 0 ? `${days}д` : `${days}д ${restHours}ч`;
};

export const formatDateTime = (value: string): string =>
  new Date(value).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

export const generateTaskId = (tasks: Task[]): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const existingIds = new Set(tasks.map((task) => task.id));

  for (;;) {
    const prefix = `${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}`;
    const numeric = Math.floor(Math.random() * 9000) + 1000;
    const taskId = `${prefix}-${numeric}`;
    if (!existingIds.has(taskId)) return taskId;
  }
};

export const getMemberName = (members: TeamMember[], id: string): string =>
  members.find((member) => member.id === id)?.fullName || 'Не назначен';

export const getSprintRemainingHours = (sprint: Sprint | null, tasks: Task[]): number => {
  if (!sprint) return 0;

  const totalHours = sprint.durationDays * 8;
  const reservedHours = tasks
    .filter((task) => task.sprintId === sprint.id)
    .reduce((sum, task) => sum + task.estimateHours, 0);

  return totalHours - reservedHours;
};

export const getProgressPercent = (done: number, total: number): number => {
  if (!total) return 0;
  return Math.round((done / total) * 100);
};

export const getTaskLoadByMember = (tasks: Task[], members: TeamMember[]) =>
  members.map((member) => ({
    label: member.fullName.split(' ')[0],
    value: tasks.filter((task) => task.assigneeId === member.id && task.status !== 'done').reduce((sum, task) => sum + task.estimateHours, 0)
  }));

export const formatDateRange = (startDate: string, endDate: string): string => `${startDate} — ${endDate}`;

export const sortTasks = (tasks: Task[], sortBy: 'newest' | 'estimateDesc' | 'estimateAsc' | 'title' | 'priority' | 'recentlyUpdated') => {
  const nextTasks = [...tasks];

  switch (sortBy) {
    case 'estimateDesc':
      return nextTasks.sort((a, b) => b.estimateHours - a.estimateHours);
    case 'estimateAsc':
      return nextTasks.sort((a, b) => a.estimateHours - b.estimateHours);
    case 'title':
      return nextTasks.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
    case 'recentlyUpdated':
      return nextTasks.sort((a, b) => +new Date(b.updatedAt || b.createdAt) - +new Date(a.updatedAt || a.createdAt));
    case 'priority':
      return nextTasks.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority] || +new Date(b.createdAt) - +new Date(a.createdAt));
    case 'newest':
    default:
      return nextTasks.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }
};

export const getUtilizationPercent = (sprint: Sprint | null, tasks: Task[]) => {
  if (!sprint) return 0;
  const totalHours = sprint.durationDays * 8;
  if (!totalHours) return 0;
  const reservedHours = tasks.filter((task) => task.sprintId === sprint.id).reduce((sum, task) => sum + task.estimateHours, 0);
  return Math.round((reservedHours / totalHours) * 100);
};

export const getWipAlerts = (tasks: Task[], members: TeamMember[]) =>
  members
    .map((member) => ({
      member,
      activeTasks: tasks.filter((task) => task.assigneeId === member.id && task.status === 'inProgress')
    }))
    .filter((item) => item.activeTasks.length > 1);

export const getRecentTasks = (tasks: Task[], limit = 5) => sortTasks(tasks, 'recentlyUpdated').slice(0, limit);

export const getRecentActivity = (events: ActivityEvent[], limit = 6) =>
  [...events].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, limit);

export const getTaskAgeDays = (value: string): number => {
  const created = new Date(value).getTime();
  const now = Date.now();
  const diff = now - created;
  if (Number.isNaN(diff) || diff <= 0) return 0;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const getTaskFreshnessDays = (task: Task): number => getTaskAgeDays(task.updatedAt || task.createdAt);

export const getStaleTasks = (tasks: Task[], ageThresholdDays = 3) =>
  tasks.filter((task) => task.status !== 'done' && getTaskFreshnessDays(task) >= ageThresholdDays);

export const getPrioritySummary = (tasks: Task[]) => [
  { label: priorityLabels.low, value: tasks.filter((task) => task.priority === 'low').length },
  { label: priorityLabels.medium, value: tasks.filter((task) => task.priority === 'medium').length },
  { label: priorityLabels.high, value: tasks.filter((task) => task.priority === 'high').length },
  { label: priorityLabels.critical, value: tasks.filter((task) => task.priority === 'critical').length }
];

export const getCategorySummary = (tasks: Task[]) => [
  { label: categoryLabels.feature, value: tasks.filter((task) => task.category === 'feature').length },
  { label: categoryLabels.bug, value: tasks.filter((task) => task.category === 'bug').length },
  { label: categoryLabels.techDebt, value: tasks.filter((task) => task.category === 'techDebt').length },
  { label: categoryLabels.research, value: tasks.filter((task) => task.category === 'research').length },
  { label: categoryLabels.operations, value: tasks.filter((task) => task.category === 'operations').length }
];

export const getTaskById = (tasks: Task[], taskId: string) => tasks.find((task) => task.id === taskId) || null;

export const getOpenDependencyTasks = (task: Task, tasks: Task[]) =>
  task.blockedByTaskIds
    .map((dependencyId) => getTaskById(tasks, dependencyId))
    .filter((dependency): dependency is Task => Boolean(dependency && dependency.status !== 'done'));

export const hasDependencyRisk = (task: Task, tasks: Task[]) => getOpenDependencyTasks(task, tasks).length > 0;

export const getDependencyRiskTasks = (tasks: Task[]) =>
  sortTasks(tasks.filter((task) => task.status !== 'done' && hasDependencyRisk(task, tasks)), 'priority');

export const getDependencySummary = (tasks: Task[]) => [
  { label: 'Без зависимостей', value: tasks.filter((task) => task.blockedByTaskIds.length === 0).length },
  { label: '1 зависимость', value: tasks.filter((task) => task.blockedByTaskIds.length === 1).length },
  { label: '2+ зависимостей', value: tasks.filter((task) => task.blockedByTaskIds.length >= 2).length }
];

export const getDependencyHotspots = (tasks: Task[]) => {
  const counts = new Map<string, number>();
  tasks.forEach((task) => {
    task.blockedByTaskIds.forEach((dependencyId) => {
      counts.set(dependencyId, (counts.get(dependencyId) || 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .map(([taskId, blockedCount]) => ({
      task: getTaskById(tasks, taskId),
      blockedCount
    }))
    .filter((item): item is { task: Task; blockedCount: number } => Boolean(item.task))
    .sort((a, b) => b.blockedCount - a.blockedCount || priorityWeight[b.task.priority] - priorityWeight[a.task.priority])
    .slice(0, 5);
};

export const getHealthScore = (sprint: Sprint | null, tasks: Task[], members: TeamMember[]) => {
  let score = 100;
  const staleTasks = getStaleTasks(tasks, 3).length;
  const wipAlerts = getWipAlerts(tasks, members).length;
  const utilization = getUtilizationPercent(sprint, tasks);
  const criticalOpen = tasks.filter((task) => task.priority === 'critical' && task.status !== 'done').length;
  const unresolvedBugs = tasks.filter((task) => task.category === 'bug' && task.status !== 'done').length;
  const blocked = getBlockedTasks(tasks).length;
  const dependencyRisk = getDependencyRiskTasks(tasks).length;

  score -= staleTasks * 8;
  score -= wipAlerts * 10;
  score -= criticalOpen * 6;
  score -= blocked * 5;
  score -= Math.min(dependencyRisk * 4, 16);
  score -= Math.min(unresolvedBugs * 4, 12);
  if (utilization > 100) score -= 18;
  if (utilization > 90 && utilization <= 100) score -= 8;

  return Math.max(0, Math.min(100, score));
};

export const getHealthLabel = (score: number) => {
  if (score >= 85) return 'Стабильно';
  if (score >= 70) return 'Под контролем';
  if (score >= 50) return 'Требует внимания';
  return 'Зона риска';
};

export const getMemberCapacityView = (tasks: Task[], members: TeamMember[]) =>
  members.map((member) => {
    const assigned = tasks.filter((task) => task.assigneeId === member.id && task.status !== 'done');
    const hours = assigned.reduce((sum, task) => sum + task.estimateHours, 0);
    const critical = assigned.filter((task) => priorityWeight[task.priority] >= 3).length;
    const waitingOnDependencies = assigned.filter((task) => hasDependencyRisk(task, tasks)).length;

    return {
      id: member.id,
      name: member.fullName,
      hours,
      active: assigned.length,
      critical,
      blocked: assigned.filter((task) => task.blocked).length,
      dependencyRisk: waitingOnDependencies,
      utilizationLabel: hours > 20 ? 'Перегрузка' : hours > 12 ? 'Высокая' : 'Нормальная'
    };
  });

export const getFocusTasks = (tasks: Task[]) =>
  sortTasks(
    tasks.filter((task) => task.status !== 'done' && (task.priority === 'critical' || task.priority === 'high' || task.blocked || hasDependencyRisk(task, tasks) || getTaskFreshnessDays(task) >= 3)),
    'priority'
  ).slice(0, 5);

export const getRiskTasks = (tasks: Task[]) =>
  sortTasks(
    tasks.filter((task) => task.status !== 'done' && (task.blocked || hasDependencyRisk(task, tasks) || getTaskFreshnessDays(task) >= 3 || task.priority === 'critical' || task.category === 'bug')),
    'priority'
  ).slice(0, 6);

export const getBlockedTasks = (tasks: Task[]) =>
  sortTasks(tasks.filter((task) => task.blocked && task.status !== 'done'), 'priority');

export const getStatusSummary = (tasks: Task[]) => [
  { label: statusLabels.backlog, value: tasks.filter((task) => task.status === 'backlog').length },
  { label: statusLabels.todo, value: tasks.filter((task) => task.status === 'todo').length },
  { label: statusLabels.inProgress, value: tasks.filter((task) => task.status === 'inProgress').length },
  { label: statusLabels.done, value: tasks.filter((task) => task.status === 'done').length }
];

export const getBlockedLoadHours = (tasks: Task[]) =>
  tasks.filter((task) => task.blocked && task.status !== 'done').reduce((sum, task) => sum + task.estimateHours, 0);
