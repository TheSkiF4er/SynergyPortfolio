import { useAppContext } from '../context/AppContext';
import { formatEstimate, getMemberName, statusFlow, statusLabels } from '../utils/helpers';
import { Task } from '../utils/types';

type Props = {
  task: Task;
  showStatusActions?: boolean;
};

const TaskCard = ({ task, showStatusActions = false }: Props) => {
  const { members, updateTaskStatus } = useAppContext();
  const currentIndex = statusFlow.indexOf(task.status);
  const canMoveBack = currentIndex > 0;
  const canMoveForward = currentIndex < statusFlow.length - 1;

  return (
    <article className="task-card">
      <div className="task-card-top">
        <span className="task-id">{task.id}</span>
        <div className="task-pill-row">
          <span className={`status-badge status-${task.status}`}>{statusLabels[task.status]}</span>
          <span className="status-badge">{formatEstimate(task.estimateHours)}</span>
        </div>
      </div>
      <h3>{task.title}</h3>
      <p className="task-subtitle">{task.subtitle}</p>
      <div className="task-meta">
        <span>Автор: {getMemberName(members, task.authorId)}</span>
        <span>Исполнитель: {getMemberName(members, task.assigneeId)}</span>
      </div>
      <p className="task-description">{task.description}</p>
      {task.comments ? <p className="task-comments">Комментарий: {task.comments}</p> : null}
      {task.watchers.length > 0 ? (
        <p className="task-watchers">
          Наблюдатели: {task.watchers.map((watcherId) => getMemberName(members, watcherId)).join(', ')}
        </p>
      ) : null}
      {showStatusActions ? (
        <div className="task-actions">
          <button type="button" className="secondary-button" disabled={!canMoveBack} onClick={() => canMoveBack && updateTaskStatus(task.id, statusFlow[currentIndex - 1])}>
            ← Назад
          </button>
          <button type="button" className="primary-button" disabled={!canMoveForward} onClick={() => canMoveForward && updateTaskStatus(task.id, statusFlow[currentIndex + 1])}>
            Вперёд →
          </button>
        </div>
      ) : null}
    </article>
  );
};

export default TaskCard;
