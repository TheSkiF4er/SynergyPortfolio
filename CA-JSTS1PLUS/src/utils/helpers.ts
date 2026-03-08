import { Sprint, Task, TaskStatus, TeamMember } from './types';

export const statusLabels: Record<TaskStatus, string> = {
  backlog: 'Backlog',
  todo: 'К выполнению',
  inProgress: 'В работе',
  done: 'Готово'
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

export const getMemberName = (members: TeamMember[], id: string): string => {
  return members.find((member) => member.id === id)?.fullName || 'Не назначен';
};

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
