export const API_URL = import.meta.env.VITE_API_URL || 'https://api-khepraexperts.fly.dev';

export async function getHealth() {
  const res = await fetch(`${API_URL}/health`);
  if (!res.ok) throw new Error('API offline');
  return res.json();
}

export async function getStatus() {
  const res = await fetch(`${API_URL}/api/status`);
  return res.json();
}
