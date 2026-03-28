import apiClient from '@/lib/apiClient';

export async function getReports() {
  const { data } = await apiClient.get('/reports');
  return data.data;
}
