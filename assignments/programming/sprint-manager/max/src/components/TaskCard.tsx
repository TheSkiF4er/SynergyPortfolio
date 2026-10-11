import { useAppContext } from '../context/AppContext';
import {
  categoryLabels,
  formatDateTime,
  formatEstimate,
  getMemberName,
  getOpenDependencyTasks,
  getTaskAgeDays,
  getTaskFreshnessDays,
  hasDependencyRisk,
  priorityLabels,
  statusFlow,
  statusLabels
} from '../utils/helpers';
import { Task } from '../utils/types';

type Props = {
  task: Task;
  showStatusActions?: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
};

const TaskCard = ({ task, showStatusActions = false, onEdit, onDelete }: Props) => {
  const { members, tasks, updateTaskStatus } = useAppContext();
  const currentIndex = statusFlow.indexOf(task.status);
  const canMoveBack = currentIndex > 0;
  const canMoveForward = currentIndex < statusFlow.length - 1;
  const taskAgeDays = getTaskAgeDays(task.createdAt);
  const freshnessDays = getTaskFreshnessDays(task);
  const isStale = task.status !== 'done' && freshnessDays >= 3;
  const dependencyRisk = hasDependencyRisk(task, tasks);
  const openDependencies = getOpenDependencyTasks(task, tasks);

  return (
    <article className={`task-card ${task.blocked ? 'task-card-blocked' : ''} ${dependencyRisk ? 'task-card-dependent' : ''}`}>
      <div className="task-card-top">
        <span className="task-id">{task.id}</span>
        <div className="task-pill-row">
          {task.blocked ? <span className="status-badge status-blocked">Blocked</span> : null}
          {dependencyRisk ? <span className="status-badge status-dependent">Depends on</span> : null}
          <span className={`status-badge category-badge category-${task.category}`}>{categoryLabels[task.category]}</span>
          <span className={`status-badge status-priority priority-${task.priority}`}>{priorityLabels[task.priority]}</span>
          <span className={`status-badge status-${task.status}`}>{statusLabels[task.status]}</span>
          <span className="status-badge">{formatEstimate(task.estimateHours)}</span>
          <span className={`status-badge ${isStale ? 'status-risk' : ''}`}>{freshnessDays}д без обновлений</span>
        </div>
      </div>
      <h3>{task.title}</h3>
      <p className="task-subtitle">{task.subtitle}</p>
      <div className="task-meta">
        <span>Автор: {getMemberName(members, task.authorId)}</span>
        <span>Исполнитель: {getMemberName(members, task.assigneeId)}</span>
      </div>
      <p className="task-description">{task.description}</p>
      {task.blocked && task.blockerReason ? <p className="task-blocker">Блокер: {task.blockerReason}</p> : null}
      {dependencyRisk ? (
        <div className="task-dependency-box">
          <strong>Ожидает зависимости</strong>
          <p>{openDependencies.map((dependency) => `${dependency.id} — ${dependency.title}`).join('; ')}</p>
        </div>
      ) : null}
      {task.comments ? <p className="task-comments">Комментарий: {task.comments}</p> : null}
      {task.watchers.length > 0 ? (
        <p className="task-watchers">
          Наблюдатели: {task.watchers.map((watcherId) => getMemberName(members, watcherId)).join(', ')}
        </p>
      ) : null}
      {task.blockedByTaskIds.length > 0 ? (
        <p className="task-watchers">
          Зависит от: {task.blockedByTaskIds.join(', ')}
        </p>
      ) : null}
      <p className="task-footnote">
        Создано: {formatDateTime(task.createdAt)} • Возраст: {taskAgeDays}д{task.updatedAt ? ` • Обновлено: ${formatDateTime(task.updatedAt)}` : ''}
      </p>
      {showStatusActions ? (
        <div className="task-actions task-actions-stack">
          <div className="task-actions">
            <button type="button" className="secondary-button" disabled={!canMoveBack} onClick={() => canMoveBack && updateTaskStatus(task.id, statusFlow[currentIndex - 1])}>
              ← Назад
            </button>
            <button type="button" className="primary-button" disabled={!canMoveForward} onClick={() => canMoveForward && updateTaskStatus(task.id, statusFlow[currentIndex + 1])}>
              Вперёд →
            </button>
          </div>
          <label className="inline-select-row">
            <span className="field-hint">Быстро сменить статус</span>
            <select value={task.status} onChange={(event) => updateTaskStatus(task.id, event.target.value as Task['status'])}>
              {statusFlow.map((status) => (
                <option key={status} value={status}>{statusLabels[status]}</option>
              ))}
            </select>
          </label>
        </div>
      ) : null}
      {onEdit || onDelete ? (
        <div className="task-actions task-actions-soft">
          {onEdit ? <button type="button" className="secondary-button" onClick={() => onEdit(task)}>Редактировать</button> : null}
          {onDelete ? <button type="button" className="secondary-button danger-button" onClick={() => onDelete(task)}>Удалить</button> : null}
        </div>
      ) : null}
    </article>
  );
};

export default TaskCard;
