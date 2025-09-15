// Authentication
export async function login(e_mail: string, password: string) {
  const res = await fetch("http://localhost:3001/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ e_mail, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  const data = await res.json();
  localStorage.setItem("jwtToken", data.token); // store JWT
  return data;
}

export async function getMe() {
  return apiRequest("/players/me");
}

export async function createRecord(record: Partial<{ resultPlayerOne: number; resultPlayerTwo: number; aiOpponent: boolean }>) {
  return apiRequest("/players/me/matches", "POST", record);
}

export async function updateMyStats(stats: Partial<{ victories: number; defeats: number }>) {
  return apiRequest("/players/me/stats", "PUT", stats);
}

export async function updatePlayerInfo(data: Partial<{ name: string; e_mail: string; avatar: string }>) {
  return apiRequest("/players/me", "PUT", data);
}

export async function getAllPlayers() {
  return apiRequest("/players");
}

export async function addFriend(friendId: number) {
  return apiRequest(`/players/me/friends/${friendId}`, "POST");
}

export async function removeFriend(friendId: number) {
  return apiRequest(`/players/me/friends/${friendId}`, "DELETE");
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
