import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { initialMembers, initialSprint, initialTasks } from '../utils/mockData';
import { ActivityEvent, Sprint, Task, TeamMember } from '../utils/types';

type AppContextValue = {
  members: TeamMember[];
  sprint: Sprint | null;
  tasks: Task[];
  activityLog: ActivityEvent[];
  lastSavedAt: string | null;
  addMember: (member: TeamMember) => void;
  saveSprint: (sprint: Sprint) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  exportData: () => void;
  importData: (file: File) => Promise<{ ok: boolean; message: string }>;
  resetDemoData: () => void;
};

type PersistedState = {
  members: TeamMember[];
  sprint: Sprint | null;
  tasks: Task[];
  activityLog: ActivityEvent[];
  lastSavedAt: string | null;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);
const STORAGE_KEY = 'sprintnova-control-state-v10';

const seedActivity: ActivityEvent[] = [
  {
    id: 'seed-1',
    type: 'system',
    title: 'Workspace initialized',
    description: 'Стартовые демо-данные развернуты для SprintNova Control Release 10.',
    createdAt: '2026-03-06T09:00:00.000Z'
  }
];

const defaultState: PersistedState = {
  members: initialMembers,
  sprint: initialSprint,
  tasks: initialTasks,
  activityLog: seedActivity,
  lastSavedAt: null
};

const isValidImportedState = (data: unknown): data is Partial<PersistedState> => {
  if (!data || typeof data !== 'object') return false;
  return true;
};

const createActivityEvent = (type: ActivityEvent['type'], title: string, description: string): ActivityEvent => ({
  id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  type,
  title,
  description,
  createdAt: new Date().toISOString()
});

const normalizeTasks = (items: Task[]): Task[] =>
  items.map((task) => ({
    ...task,
    priority: task.priority || 'medium',
    category: task.category || 'feature',
    blocked: Boolean(task.blocked),
    blockedByTaskIds: Array.isArray(task.blockedByTaskIds) ? task.blockedByTaskIds : [],
    blockerReason: task.blockerReason,
    updatedAt: task.updatedAt || task.createdAt
  }));

export const AppProvider = ({ children }: PropsWithChildren) => {
  const [members, setMembers] = useState<TeamMember[]>(defaultState.members);
  const [sprint, setSprint] = useState<Sprint | null>(defaultState.sprint);
  const [tasks, setTasks] = useState<Task[]>(defaultState.tasks);
  const [activityLog, setActivityLog] = useState<ActivityEvent[]>(defaultState.activityLog);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(defaultState.lastSavedAt);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      setHydrated(true);
      return;
    }

    try {
      const parsed = JSON.parse(saved) as Partial<PersistedState>;
      if (!isValidImportedState(parsed)) throw new Error('Invalid state payload');
      setMembers(Array.isArray(parsed.members) && parsed.members.length ? parsed.members : defaultState.members);
      setSprint(parsed.sprint ?? defaultState.sprint);
      setTasks(Array.isArray(parsed.tasks) ? normalizeTasks(parsed.tasks) : defaultState.tasks);
      setActivityLog(Array.isArray(parsed.activityLog) && parsed.activityLog.length ? parsed.activityLog : defaultState.activityLog);
      setLastSavedAt(typeof parsed.lastSavedAt === 'string' ? parsed.lastSavedAt : null);
    } catch (error) {
      console.error('Не удалось прочитать состояние приложения', error);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const nextSavedAt = new Date().toISOString();
    setLastSavedAt(nextSavedAt);
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ members, sprint, tasks, activityLog, lastSavedAt: nextSavedAt } satisfies PersistedState)
    );
  }, [activityLog, hydrated, members, sprint, tasks]);

  const pushActivity = (type: ActivityEvent['type'], title: string, description: string) => {
    setActivityLog((current) => [createActivityEvent(type, title, description), ...current].slice(0, 80));
  };

  const exportData = () => {
    const payload = {
      product: 'SprintNova Control',
      version: '10.0.0',
      exportedAt: new Date().toISOString(),
      data: { members, sprint, tasks, activityLog, lastSavedAt }
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sprintnova-control-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const importData = async (file: File): Promise<{ ok: boolean; message: string }> => {
    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw) as { data?: Partial<PersistedState> } | Partial<PersistedState>;
      const payload = 'data' in parsed && parsed.data ? parsed.data : parsed;

      if (!isValidImportedState(payload)) {
        return { ok: false, message: 'Файл не похож на экспорт SprintNova Control.' };
      }

      const nextMembers = Array.isArray(payload.members) && payload.members.length ? payload.members : null;
      const nextTasks = Array.isArray(payload.tasks) ? normalizeTasks(payload.tasks) : null;

      if (!nextMembers || !nextTasks) {
        return { ok: false, message: 'В файле отсутствуют обязательные данные команды или задач.' };
      }

      setMembers(nextMembers);
      setSprint(payload.sprint ?? null);
      setTasks(nextTasks);
      setActivityLog(Array.isArray(payload.activityLog) && payload.activityLog.length ? payload.activityLog : defaultState.activityLog);
      setLastSavedAt(new Date().toISOString());
      pushActivity('system', 'Data imported', `В рабочее пространство загружен файл ${file.name}.`);
      return { ok: true, message: 'Данные успешно импортированы.' };
    } catch (error) {
      console.error('Не удалось импортировать данные', error);
      return { ok: false, message: 'Не удалось прочитать JSON-файл импорта.' };
    }
  };

  const value = useMemo<AppContextValue>(
    () => ({
      members,
      sprint,
      tasks,
      activityLog,
      lastSavedAt,
      addMember: (member) => {
        setMembers((current) => [...current, member]);
        pushActivity('member', 'Member added', `В состав delivery-команды добавлен ${member.fullName}.`);
      },
      saveSprint: (nextSprint) => {
        setSprint(nextSprint);
        pushActivity('sprint', 'Sprint updated', `Параметры спринта ${nextSprint.name} сохранены.`);
      },
      addTask: (task) => {
        const normalizedTask = {
          ...task,
          blocked: Boolean(task.blocked),
          blockedByTaskIds: Array.isArray(task.blockedByTaskIds) ? task.blockedByTaskIds : [],
          blockerReason: task.blocked ? task.blockerReason : undefined,
          updatedAt: task.updatedAt || new Date().toISOString()
        };
        setTasks((current) => [normalizedTask, ...current]);
        pushActivity('task', 'Task created', `Создана задача ${task.id} — ${task.title}.`);
      },
      updateTask: (taskId, updates) => {
        setTasks((current) =>
          current.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  ...updates,
                  blocked: updates.blocked ?? task.blocked,
                  blockedByTaskIds: Array.isArray(updates.blockedByTaskIds) ? updates.blockedByTaskIds.filter((id) => id !== taskId) : task.blockedByTaskIds,
                  blockerReason: updates.blocked === false ? undefined : (updates.blockerReason ?? task.blockerReason),
                  updatedAt: new Date().toISOString()
                }
              : task
          )
        );
        pushActivity('task', 'Task updated', `Обновлена задача ${taskId}.`);
      },
      deleteTask: (taskId) => {
        setTasks((current) => current.filter((task) => task.id !== taskId).map((task) => ({ ...task, blockedByTaskIds: task.blockedByTaskIds.filter((dependencyId) => dependencyId !== taskId), updatedAt: new Date().toISOString() })));
        pushActivity('task', 'Task removed', `Задача ${taskId} удалена из реестра и снята из зависимостей других карточек.`);
      },
      updateTaskStatus: (taskId, status) => {
        setTasks((current) => current.map((task) => (task.id === taskId ? { ...task, status, blocked: status === 'done' ? false : task.blocked, blockerReason: status === 'done' ? undefined : task.blockerReason, updatedAt: new Date().toISOString() } : task)));
        pushActivity('task', 'Status changed', `Для задачи ${taskId} установлен статус ${status}.`);
      },
      exportData,
      importData,
      resetDemoData: () => {
        setMembers(defaultState.members);
        setSprint(defaultState.sprint);
        setTasks(defaultState.tasks);
        setActivityLog(defaultState.activityLog);
        setLastSavedAt(new Date().toISOString());
        pushActivity('system', 'Workspace reset', 'Стартовые данные были восстановлены пользователем.');
      }
    }),
    [activityLog, lastSavedAt, members, sprint, tasks]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used inside AppProvider');
  return context;
};
