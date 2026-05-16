import client from './client';

export const getTasks = async (projectId, params) => {
  const res = await client.get(`/projects/${projectId}/tasks`, { params });
  return res.data.tasks;
};

export const createTask = async (projectId, data) => {
  const res = await client.post(`/projects/${projectId}/tasks`, data);
  return res.data.task;
};

export const updateTask = async (projectId, taskId, data) => {
  const res = await client.put(`/projects/${projectId}/tasks/${taskId}`, data);
  return res.data.task;
};

export const updateTaskStatus = async (projectId, taskId, status) => {
  const res = await client.patch(`/projects/${projectId}/tasks/${taskId}/status`, { status });
  return res.data.task;
};

export const deleteTask = async (projectId, taskId) => {
  const res = await client.delete(`/projects/${projectId}/tasks/${taskId}`);
  return res.data;
};
