import api from '../api/api';

const applicationService = {
  createApplication: async (application) => {
    // application has: problemId, workerId, cost, message, estimatedTime, status
    const response = await api.post('/application/create', application);
    return response.data;
  },

  getApplicationById: async (id) => {
    const response = await api.get(`/application/get/${id}`);
    return response.data;
  },

  updateApplication: async (id, application) => {
    const response = await api.put(`/application/update/${id}`, application);
    return response.data;
  },

  deleteApplicationById: async (id) => {
    const response = await api.delete(`/application/delete/${id}`);
    return response.data;
  },

  acceptApplication: async (id) => {
    // POST /application/accept/{id}
    const response = await api.post(`/application/accept/${id}`);
    return response.data;
  },

  getApplicationsByProblem: async (problemId) => {
    const response = await api.get(`/application/problem/${problemId}`);
    return response.data;
  },

  getApplicationsByWorker: async (workerId) => {
    const response = await api.get(`/application/worker/${workerId}`);
    return response.data;
  },
};

export default applicationService;
