import client from './client';

export const getProjects = async () => {
  const res = await client.get('/projects');
  return res.data.projects;
};

export const getProject = async (id) => {
  const res = await client.get(`/projects/${id}`);
  return res.data.project;
};

export const createProject = async (data) => {
  const res = await client.post('/projects', data);
  return res.data.project;
};

export const updateProject = async (id, data) => {
  const res = await client.put(`/projects/${id}`, data);
  return res.data.project;
};

export const deleteProject = async (id) => {
  const res = await client.delete(`/projects/${id}`);
  return res.data;
};

export const addMember = async (projectId, data) => {
  const res = await client.post(`/projects/${projectId}/members`, data);
  return res.data;
};

export const removeMember = async (projectId, userId) => {
  const res = await client.delete(`/projects/${projectId}/members/${userId}`);
  return res.data;
};
