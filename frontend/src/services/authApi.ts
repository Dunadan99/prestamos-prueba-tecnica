import { api } from './http.ts';

export async function login(username: string, password: string): Promise<void> {
  const { data } = await api.post('/auth/login/', { username, password });
  const { access, refresh } = data;
  saveToken(access, refresh);
}

export function logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
}

export async function getNewToken(): Promise<string> {
  const refreshToken = localStorage.getItem('refreshToken');
  const { data } = await api.post('/auth/login/refresh/', {
    refresh: refreshToken,
  });
  const { access, refresh } = data;
  saveToken(access, refresh);
  return access;
}

function saveToken(token?: string, refreshToken?: string) {
  if (token) {
    localStorage.setItem('token', token);
  }
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
}
