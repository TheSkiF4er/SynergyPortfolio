import { Sprint, Task, TeamMember } from './types';

export const initialMembers: TeamMember[] = [
  { id: 'u1', fullName: 'Иван Петров', position: 'Frontend Developer', department: 'Product Team' },
  { id: 'u2', fullName: 'Анна Смирнова', position: 'QA Engineer', department: 'Quality Assurance' },
  { id: 'u3', fullName: 'Дмитрий Орлов', position: 'Project Manager', department: 'Delivery' },
  { id: 'u4', fullName: 'Мария Соколова', position: 'UI/UX Designer', department: 'Design' }
];

export const initialSprint: Sprint = {
  id: 'sprint-1',
  name: 'Sprint Alpha',
  goal: 'Собрать MVP доски задач и статистики команды',
  durationDays: 10,
  startDate: '2026-03-02',
  endDate: '2026-03-13'
};

export const initialTasks: Task[] = [
  {
    id: 'FE-1204',
    title: 'Сверстать главную страницу',
    subtitle: 'Сделать вкладки Product и Backlog',
    authorId: 'u3',
    assigneeId: 'u1',
    estimateHours: 12,
    description: 'Подготовить адаптивную главную страницу со статистикой по задачам, текущему спринту и фильтрацией only my issues.',
    watchers: ['u4'],
    blockedByTaskIds: [],
    status: 'done',
    priority: 'medium',
    category: 'feature',
    blocked: false,
    sprintId: 'sprint-1',
    createdAt: '2026-03-02T10:00:00.000Z',
    updatedAt: '2026-03-04T15:00:00.000Z'
  },
  {
    id: 'QA-2031',
    title: 'Проверить создание задач',
    subtitle: 'Покрыть валидации формы',
    authorId: 'u3',
    assigneeId: 'u2',
    estimateHours: 6,
    description: 'Проверить обязательные и необязательные поля формы, валидацию описания и комментариев, а также ограничение по времени спринта.',
    watchers: ['u1'],
    blockedByTaskIds: ['FE-1204'],
    status: 'inProgress',
    priority: 'high',
    category: 'bug',
    blocked: true,
    blockerReason: 'Ожидается решение по спорному сценарию импорта данных и подтверждение QA-критериев.',
    sprintId: 'sprint-1',
    createdAt: '2026-03-03T09:30:00.000Z',
    updatedAt: '2026-03-06T09:30:00.000Z'
  },
  {
    id: 'DS-4017',
    title: 'Подготовить макет карточки',
    subtitle: 'Описать вид карточек на канбане',
    authorId: 'u4',
    assigneeId: 'u4',
    estimateHours: 8,
    description: 'Создать единый шаблон карточки задачи для доски активного спринта, предусмотреть показ автора, исполнителя и оценки по времени.',
    comments: 'Важно предусмотреть компактный вид для мобильных устройств и возможность отображения наблюдателей.',
    watchers: ['u1', 'u3'],
    blockedByTaskIds: ['QA-2031'],
    status: 'todo',
    priority: 'medium',
    category: 'research',
    blocked: false,
    sprintId: 'sprint-1',
    createdAt: '2026-03-04T11:45:00.000Z',
    updatedAt: '2026-03-04T11:45:00.000Z'
  },
  {
    id: 'PM-5102',
    title: 'Собрать backlog следующего спринта',
    subtitle: 'Приоритизировать входящий поток',
    authorId: 'u3',
    assigneeId: 'u3',
    estimateHours: 10,
    description: 'Синхронизировать product backlog, выявить критические элементы и подготовить очередь задач для следующего цикла планирования.',
    watchers: ['u1', 'u2'],
    blockedByTaskIds: ['DS-4017'],
    status: 'backlog',
    priority: 'critical',
    category: 'operations',
    blocked: false,
    sprintId: 'sprint-1',
    createdAt: '2026-03-05T14:20:00.000Z',
    updatedAt: '2026-03-05T14:20:00.000Z'
  },
  {
    id: 'UX-6120',
    title: 'Аудит пустых состояний',
    subtitle: 'Улучшить опыт при отсутствии данных',
    authorId: 'u4',
    assigneeId: 'u1',
    estimateHours: 5,
    description: 'Проверить сценарии отсутствия результатов поиска, пустого backlog и пустого журнала операций, чтобы интерфейс выглядел зрелым во всех режимах.',
    watchers: ['u3'],
    blockedByTaskIds: ['DS-4017'],
    status: 'todo',
    priority: 'low',
    category: 'techDebt',
    blocked: false,
    sprintId: 'sprint-1',
    createdAt: '2026-03-06T08:10:00.000Z',
    updatedAt: '2026-03-06T08:10:00.000Z'
  }
];
