// Thin wrapper around fetch. Throws an Error with a readable message on failure.
async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${res.status})`);
  }
  return res.json();
}

export const createGame = (player1, player2) =>
  request('/api/games', { method: 'POST', body: JSON.stringify({ player1, player2 }) });

export const getGame = (id) => request(`/api/games/${id}`);

export const getGames = () => request('/api/games');

export const addRound = (id, roundNo, p1Choice, p2Choice) =>
  request(`/api/games/${id}/rounds`, {
    method: 'POST',
    body: JSON.stringify({ roundNo, p1Choice, p2Choice }),
  });
