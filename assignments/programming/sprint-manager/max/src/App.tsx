import { NavLink, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import SprintBoardPage from './pages/SprintBoardPage';
import AdminPage from './pages/AdminPage';
import { useAppContext } from './context/AppContext';
import { getDependencyRiskTasks } from './utils/helpers';

const formatSavedAt = (value: string | null) => {
  if (!value) return 'Локальные изменения сохраняются автоматически';

  return `Последнее сохранение: ${new Date(value).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`;
};

const App = () => {
  const { sprint, lastSavedAt, activityLog, tasks } = useAppContext();
  const blockedCount = tasks.filter((task) => task.blocked && task.status !== 'done').length;
  const dependencyRiskCount = getDependencyRiskTasks(tasks).length;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand-mark">SN</div>
          <p className="eyebrow">Product operations workspace</p>
          <h1>SprintNova Control</h1>
          <p className="sidebar-text">
            Единое пространство для управления спринтами: от планирования нагрузки и состава команды до контроля прогресса,
            качества исполнения, приоритетов, блокеров, зависимостей между задачами и устойчивости данных.
          </p>
        </div>

        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Executive overview</NavLink>
          <NavLink to="/sprint" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Delivery board</NavLink>
          <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Operations studio</NavLink>
        </nav>

        <div className="sidebar-footer">
          <span className="release-badge">Release 10.0</span>
          <p>{formatSavedAt(lastSavedAt)}</p>
          {sprint ? (
            <div className="sidebar-sprint-summary">
              <strong>{sprint.name}</strong>
              <span>{sprint.startDate} — {sprint.endDate}</span>
              <span>{blockedCount} blocked задач в активном контуре</span>
              <span>{dependencyRiskCount} задач зависят от других карточек</span>
              <span>{activityLog.length} событий в журнале операций</span>
            </div>
          ) : (
            <p className="field-hint">Спринт ещё не настроен — перейдите в Operations studio.</p>
          )}
        </div>
      </aside>

      <main className="page-content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/sprint" element={<SprintBoardPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
