
export async function createRecord(record: Partial<{ playerTwoName: string; resultPlayerOne: number; resultPlayerTwo: number; aiOpponent: boolean }>) {
  return apiRequest("/players/me/matches", "POST", record);
}

export async function updateMyStats(stats: Partial<{ victories: number; defeats: number }>) {
  return apiRequest("/players/me/stats", "PUT", stats);
}

async function apiRequest(
  endpoint: string,
  method: string = "GET",
  body?: any
) {
  const token = localStorage.getItem("jwtToken");
  if (!token) throw new Error("No token found");

  const res = await fetch(`http://localhost:3001/api${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${method} ${endpoint} failed: ${res.status} ${text}`);
  }

  return res.json();
}
