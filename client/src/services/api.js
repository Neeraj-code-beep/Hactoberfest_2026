import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Health check
 */
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

/**
 * Capture thought via Gemma AI and save
 */
export const captureThoughtApi = async (text) => {
  const response = await api.post('/capture', { text });
  return response.data;
};

/**
 * Fetch items to tell Dheeraj later
 */
export const getTellLaterItemsApi = async () => {
  const response = await api.get('/tell-later');
  return response.data;
};

/**
 * Mark a tell-later item as completed / told
 */
export const completeTellLaterApi = async (id) => {
  const response = await api.patch(`/tell-later/${id}/complete`);
  return response.data;
};

/**
 * Fetch memories timeline
 */
export const getMemoriesApi = async () => {
  const response = await api.get('/memories');
  return response.data;
};

/**
 * Fetch today's self-care status
 */
export const getSelfCareApi = async () => {
  const response = await api.get('/self-care');
  return response.data;
};

/**
 * Update today's self-care check-in
 */
export const updateSelfCareApi = async (data) => {
  const response = await api.post('/self-care', data);
  return response.data;
};

export default api;
