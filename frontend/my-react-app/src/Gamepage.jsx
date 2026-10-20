import { useEffect, useReducer, useState } from 'react';
import { addRound, createGame, getGame } from './api.js';
import { TOTAL_ROUNDS, gameReducer, initialState, score } from './gameReducer.js';

const CHOICES = [
  { id: 'STONE', label: 'Stone', icon: '✊' },
  { id: 'PAPER', label: 'Paper', icon: '✋' },
  { id: 'SCISSORS', label: 'Scissors', icon: '✌️' },
];
const icon = (id) => CHOICES.find((c) => c.id === id)?.icon ?? '';
const STORAGE_KEY = 'rps.gameId';

export default function GamePage() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [names, setNames] = useState({ p1: '', p2: '' });
  const [busy, setBusy] = useState(false);

  // On first load: if a game id is saved, ask the server for that game and rebuild state.
  useEffect(() => {
    const id = localStorage.getItem(STORAGE_KEY);
    if (!id) return dispatch({ type: 'NO_GAME' });
    getGame(id)
      .then((game) => dispatch({ type: 'LOADED', game }))
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        dispatch({ type: 'NO_GAME' });
      });
  }, []);

  const nameOf = (result) =>
    result === 'P1' ? state.p1Name : result === 'P2' ? state.p2Name : 'Tie';

  async function startGame(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const game = await createGame(names.p1, names.p2);
      localStorage.setItem(STORAGE_KEY, game.id);
      dispatch({ type: 'LOADED', game });
    } catch (err) {
      dispatch({ type: 'ERROR', message: err.message });
    } finally {
      setBusy(false);
    }
  }

  async function pick(choice) {
    if (state.phase === 'p1') return dispatch({ type: 'PICK_P1', choice });
    // Player 2 picked: now both choices exist, so save the round.
    setBusy(true);
    try {
      const game = await addRound(state.gameId, state.rounds.length + 1, state.p1Pick, choice);
      dispatch({ type: 'ROUND_SAVED', game });
    } catch (err) {
      dispatch({ type: 'ERROR', message: err.message });
    } finally {
      setBusy(false);
    }
  }

  function newGame() {
    localStorage.removeItem(STORAGE_KEY);
    setNames({ p1: '', p2: '' });
    dispatch({ type: 'RESET' });
  }

  const { phase, rounds, error } = state;
  const s = score(rounds);
  const last = rounds[rounds.length - 1];

  if (phase === 'loading') return <p className="muted">Loading…</p>;

  if (phase === 'setup') {
    return (
      <form className="panel" onSubmit={startGame}>
        <h2>Who is playing?</h2>
        <label>Player 1
          <input value={names.p1} onChange={(e) => setNames({ ...names, p1: e.target.value })}
                 maxLength={30} required />
        </label>
        <label>Player 2
          <input value={names.p2} onChange={(e) => setNames({ ...names, p2: e.target.value })}
                 maxLength={30} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="primary" disabled={busy}>Start game</button>
      </form>
    );
  }

  return (
    <>
      <section className="scorebar">
        <div className="p1"><span>{state.p1Name}</span><strong>{s.p1}</strong></div>
        <div className="mid">Round {Math.min(rounds.length + (phase === 'result' || phase === 'finished' ? 0 : 1), TOTAL_ROUNDS)} of {TOTAL_ROUNDS}</div>
        <div className="p2"><span>{state.p2Name}</span><strong>{s.p2}</strong></div>
      </section>

      {(phase === 'p1' || phase === 'p2') && (
        <section className="panel">
          <h2>{phase === 'p1' ? state.p1Name : state.p2Name}, make your pick</h2>
          <p className="muted">
            {phase === 'p1' ? 'Your choice stays hidden until the other player picks.'
                            : `${state.p1Name} has picked. Pass the device over.`}
          </p>
          <div className="choices">
            {CHOICES.map((c) => (
              <button key={c.id} className={phase === 'p1' ? 'c1' : 'c2'}
                      disabled={busy} onClick={() => pick(c.id)}>
                <span className="big">{c.icon}</span>{c.label}
              </button>
            ))}
          </div>
          {error && <p className="error">{error}</p>}
        </section>
      )}

      {phase === 'result' && last && (
        <section className="panel">
          <h2>{last.result === 'TIE' ? 'Tie round' : `${nameOf(last.result)} wins round ${last.roundNo}`}</h2>
          <p className="reveal">
            <span>{icon(last.p1Choice)}</span> vs <span>{icon(last.p2Choice)}</span>
          </p>
          <button className="primary" onClick={() => dispatch({ type: 'NEXT' })}>
            {state.status === 'FINISHED' ? 'See final result' : 'Next round'}
          </button>
        </section>
      )}

      {phase === 'finished' && (
        <section className="panel winner">
          <h2>{state.winner === 'TIE' ? 'The game is a tie' : `${nameOf(state.winner)} wins the game`}</h2>
          <p>{s.p1} – {s.p2} with {s.ties} tied {s.ties === 1 ? 'round' : 'rounds'}</p>
          <button className="primary" onClick={newGame}>New game</button>
        </section>
      )}

      <table className="rounds">
        <thead>
          <tr><th>Round</th><th>{state.p1Name}</th><th>{state.p2Name}</th><th>Result</th></tr>
        </thead>
        <tbody>
          {Array.from({ length: TOTAL_ROUNDS }, (_, i) => {
            const r = rounds[i];
            return (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{r ? icon(r.p1Choice) : ''}</td>
                <td>{r ? icon(r.p2Choice) : ''}</td>
                <td>{r ? nameOf(r.result) : '–'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
