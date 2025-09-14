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
  const token = localStorage.getItem("jwtToken");
  if (!token) throw new Error("No token found");

  console.log("Using token:", token);

  const res = await fetch("http://localhost:3001/api/players/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log("Response status:", res.status);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch user: ${res.status} ${text}`);
  }

  return res.json();
}
