import playerService from './players';

export async function login(email: string, password: string): Promise<void> {
  const players = await playerService.getAll();
  const match = players.find(p => p.email === email && p.password === password);
  if (!match) throw new Error('Invalid credentials');

  localStorage.setItem('authToken', 'dummy-token');
}

export function logout(): void {
  localStorage.removeItem('authToken');
}

export function isLoggedIn(): boolean {
  return Boolean(localStorage.getItem('authToken'));
}
