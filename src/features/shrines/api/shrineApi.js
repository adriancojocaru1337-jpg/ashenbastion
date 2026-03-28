
import apiClient from '@/lib/apiClient';

export async function getShrines() {
  const { data } = await apiClient.get('/shrines');
  return data.data;
}

export async function getShrineDetail(id) {
  const { data } = await apiClient.get(`/shrines/${id}`);
  return data.data;
}

export async function getActiveBlessing() {
  const { data } = await apiClient.get('/bastion/bonuses');
  return data.data;
}
