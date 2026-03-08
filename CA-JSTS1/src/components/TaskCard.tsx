import { useAppContext } from '../context/AppContext';
import { formatEstimate, getMemberName } from '../utils/helpers';
import { Task } from '../utils/types';

type Props = {
  task: Task;
};

const TaskCard = ({ task }: Props) => {
  const { members } = useAppContext();

  return (
    <article className="task-card">
      <div className="task-card-top">
        <span className="task-id">{task.id}</span>
        <span className={`status-badge status-${task.status}`}>{formatEstimate(task.estimateHours)}</span>
      </div>
      <h3>{task.title}</h3>
      <p className="task-subtitle">{task.subtitle}</p>
      <div className="task-meta">
        <span>Автор: {getMemberName(members, task.authorId)}</span>
        <span>Исполнитель: {getMemberName(members, task.assigneeId)}</span>
      </div>
      <p className="task-description">{task.description}</p>
      {task.watchers.length > 0 ? (
        <p className="task-watchers">
          Наблюдатели: {task.watchers.map((watcherId) => getMemberName(members, watcherId)).join(', ')}
        </p>
      ) : null}
    </article>
  );
};

export default TaskCard;
