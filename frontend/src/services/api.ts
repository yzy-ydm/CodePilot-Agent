import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  register: (data: { email: string; username: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// Projects
export const projectsApi = {
  list: () => api.get('/projects/'),
  create: (data: { name: string; description?: string; project_type?: string }) =>
    api.post('/projects/', data),
  get: (id: string) => api.get(`/projects/${id}`),
  update: (id: string, data: { name?: string; description?: string; status?: string }) =>
    api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

// Tasks
export const tasksApi = {
  list: () => api.get('/tasks/'),
  create: (data: { project_id?: string; agent_type: string; title?: string; input: string }) =>
    api.post('/tasks/', data),
  get: (id: string) => api.get(`/tasks/${id}`),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};

// Agents
export const agentsApi = {
  execute: (data: { task_id: string; agent_type: string; input: string; project_context?: string }) =>
    api.post('/agents/execute', data),
  getLogs: (taskId: string) => api.get(`/agents/logs/${taskId}`),
};

export default api;
