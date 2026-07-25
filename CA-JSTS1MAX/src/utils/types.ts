export type TaskStatus = 'backlog' | 'todo' | 'inProgress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskCategory = 'feature' | 'bug' | 'techDebt' | 'research' | 'operations';

export interface TeamMember {
  id: string;
  fullName: string;
  position: string;
  department: string;
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  durationDays: number;
  startDate: string;
  endDate: string;
}

export interface Task {
  id: string;
  title: string;
  subtitle: string;
  authorId: string;
  assigneeId: string;
  estimateHours: number;
  description: string;
  comments?: string;
  watchers: string[];
  blockedByTaskIds: string[];
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  blocked: boolean;
  blockerReason?: string;
  sprintId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ActivityEvent {
  id: string;
  type: 'member' | 'sprint' | 'task' | 'system';
  title: string;
  description: string;
  createdAt: string;
}
