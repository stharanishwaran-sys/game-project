import { NavLink, Route, Routes } from 'react-router-dom';
import GamePage from './GamePage.jsx';
import HistoryPage from './HistoryPage.jsx';

export default function App() {
  return (
    <div className="shell">
      <header className="top">
        <h1>Stone Paper Scissors</h1>
        <nav>
          <NavLink to="/" end>Play</NavLink>
          <NavLink to="/history">All games</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<GamePage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>
    </div>
  );
}
