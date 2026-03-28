import apiClient from '@/lib/apiClient';
import { USE_MOCKS, doctrineLabelFromKey } from '@/lib/mockMode';

function makeMockUser(payload = {}) {
  const doctrine = payload.doctrine || 'ember_rite';
  return {
    id: 'mock-user-1',
    username: payload.username || 'AshenWarden',
    email: payload.email || 'demo@ashenbastion.local',
    bastionName: payload.bastionName || 'Ashenbastion',
    doctrine,
    doctrineLabel: doctrineLabelFromKey(doctrine),
  };
}

export async function register(payload) {
  if (USE_MOCKS) {
    return { user: makeMockUser(payload) };
  }
  const { data } = await apiClient.post('/auth/register', payload);
  return data.data;
}

export async function login(payload) {
  if (USE_MOCKS) {
    return { user: makeMockUser(payload) };
  }
  const { data } = await apiClient.post('/auth/login', payload);
  return data.data;
}

export async function me() {
  if (USE_MOCKS) {
    return { user: makeMockUser() };
  }
  const { data } = await apiClient.get('/auth/me');
  return data.data;
}
