import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { initialMembers, initialSprint, initialTasks } from '../utils/mockData';
import { Sprint, Task, TeamMember } from '../utils/types';

type AppContextValue = {
  members: TeamMember[];
  sprint: Sprint | null;
  tasks: Task[];
  addMember: (member: TeamMember) => void;
  saveSprint: (sprint: Sprint) => void;
  addTask: (task: Task) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  resetDemoData: () => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);
const STORAGE_KEY = 'todo-sprint-app-state';

const defaultState = {
  members: initialMembers,
  sprint: initialSprint,
  tasks: initialTasks
};

export const AppProvider = ({ children }: PropsWithChildren) => {
  const [members, setMembers] = useState<TeamMember[]>(defaultState.members);
  const [sprint, setSprint] = useState<Sprint | null>(defaultState.sprint);
  const [tasks, setTasks] = useState<Task[]>(defaultState.tasks);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      setHydrated(true);
      return;
    }

    try {
      const parsed = JSON.parse(saved) as { members?: TeamMember[]; sprint?: Sprint | null; tasks?: Task[] };
      setMembers(parsed.members?.length ? parsed.members : defaultState.members);
      setSprint(parsed.sprint ?? defaultState.sprint);
      setTasks(parsed.tasks?.length ? parsed.tasks : defaultState.tasks);
    } catch (error) {
      console.error('Не удалось прочитать состояние приложения', error);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ members, sprint, tasks }));
  }, [hydrated, members, sprint, tasks]);

  const value = useMemo<AppContextValue>(
    () => ({
      members,
      sprint,
      tasks,
      addMember: (member) => setMembers((current) => [...current, member]),
      saveSprint: (nextSprint) => setSprint(nextSprint),
      addTask: (task) => setTasks((current) => [task, ...current]),
      updateTaskStatus: (taskId, status) =>
        setTasks((current) => current.map((task) => (task.id === taskId ? { ...task, status } : task))),
      resetDemoData: () => {
        setMembers(defaultState.members);
        setSprint(defaultState.sprint);
        setTasks(defaultState.tasks);
      }
    }),
    [members, sprint, tasks]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used inside AppProvider');
  return context;
};
