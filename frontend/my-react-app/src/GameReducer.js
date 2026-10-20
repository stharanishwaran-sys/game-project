// phase: 'loading' -> 'setup' -> 'p1' -> 'p2' -> 'result' -> ('p1' again | 'finished')
export const TOTAL_ROUNDS = 6;

export const initialState = {
  phase: 'loading',
  gameId: null,
  p1Name: '',
  p2Name: '',
  status: 'IN_PROGRESS', // mirrors the DB: IN_PROGRESS | FINISHED
  rounds: [],            // saved rounds, exactly as the server returns them
  p1Pick: null,          // held only in memory until player 2 picks
  winner: null,          // 'P1' | 'P2' | 'TIE' | null
  error: null,
};

export function gameReducer(state, action) {
  switch (action.type) {
    case 'NO_GAME':
      return { ...initialState, phase: 'setup' };

    // Used for a brand-new game AND for restoring after a refresh:
    // state is rebuilt entirely from what the server stored.
    case 'LOADED': {
      const g = action.game;
      return {
        ...state,
        gameId: g.id,
        p1Name: g.player1,
        p2Name: g.player2,
        rounds: g.rounds,
        status: g.status,
        winner: g.winner,
        p1Pick: null,
        error: null,
        phase: g.status === 'FINISHED' ? 'finished' : 'p1',
      };
    }

    case 'PICK_P1':
      return { ...state, p1Pick: action.choice, phase: 'p2', error: null };

    case 'ROUND_SAVED': {
      const g = action.game;
      return {
        ...state,
        rounds: g.rounds,
        status: g.status,
        winner: g.winner,
        p1Pick: null,
        phase: 'result',
        error: null,
      };
    }

    case 'NEXT':
      return { ...state, phase: state.status === 'FINISHED' ? 'finished' : 'p1' };

    case 'ERROR':
      return { ...state, error: action.message };

    case 'RESET':
      return { ...initialState, phase: 'setup' };

    default:
      return state;
  }
}

// Derived values: computed from rounds, never stored separately.
export const score = (rounds) => ({
  p1: rounds.filter((r) => r.result === 'P1').length,
  p2: rounds.filter((r) => r.result === 'P2').length,
  ties: rounds.filter((r) => r.result === 'TIE').length,
});
