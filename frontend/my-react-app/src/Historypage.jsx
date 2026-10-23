import { useEffect, useState } from 'react';
import { getGames } from './api.js';
import { score } from './gameReducer.js';

const ICONS = { STONE: 'Stone', PAPER: 'Paper', SCISSORS: 'Scissor' };

export default function HistoryPage() {
  const [games, setGames] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getGames().then(setGames).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!games) return <p className="muted">Loading…</p>;
  if (games.length === 0) return <p className="muted">No games yet. Play one first.</p>;

  const who = (g, r) => (r === 'P1' ? g.player1 : r === 'P2' ? g.player2 : 'Tie');

  return (
    <div className="history">
      {games.map((g) => {
        const s = score(g.rounds);
        return (
          <details key={g.id} className="panel game">
            <summary>
              <strong>{g.player1} vs {g.player2}</strong>
              <span className="muted"> {s.p1}–{s.p2}</span>
              <span className={`tag ${g.status === 'FINISHED' ? 'done' : ''}`}>
                {g.status === 'FINISHED'
                  ? (g.winner === 'TIE' ? 'Tie' : `${who(g, g.winner)} won`)
                  : 'In progress'}
              </span>
              <div className="muted small">{new Date(g.createdAt).toLocaleString()}</div>
            </summary>
            <table className="rounds">
              <thead><tr><th>Round</th><th>{g.player1}</th><th>{g.player2}</th><th>Result</th></tr></thead>
              <tbody>
                {g.rounds.map((r) => (
                  <tr key={r.id}>
                    <td>{r.roundNo}</td><td>{ICONS[r.p1Choice]}</td><td>{ICONS[r.p2Choice]}</td>
                    <td>{who(g, r.result)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        );
      })}
    </div>
  );
}
