import { NavLink, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import SprintBoardPage from './pages/SprintBoardPage';
import AdminPage from './pages/AdminPage';

const App = () => {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Практическое задание</p>
          <h1>TO-DO Sprint Board</h1>
        </div>

        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Главная
          </NavLink>
          <NavLink to="/sprint" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Активный спринт
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Панель администратора
          </NavLink>
        </nav>
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
