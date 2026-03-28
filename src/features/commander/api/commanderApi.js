
import apiClient from '@/lib/apiClient';

export async function getCommander() {
  const { data } = await apiClient.get('/commander');
  return data.data;
}

export async function createCommander(payload) {
  const { data } = await apiClient.post('/commander/create', payload);
  return data.data;
}
