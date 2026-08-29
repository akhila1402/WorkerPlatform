import api from '../api/api';

const workerService = {
  createWorker: async (worker) => {
    // Save worker profile (starts as pending approval)
    const response = await api.post('/worker/create', worker);
    return response.data;
  },

  getWorker: async (id) => {
    const response = await api.get(`/worker/get/${id}`);
    return response.data;
  },

  updateWorker: async (id, request) => {
    // updates only profession, latitude, longitude via DTO
    const response = await api.put(`/worker/update/${id}`, request);
    return response.data;
  },

  deleteWorker: async (id) => {
    const response = await api.delete(`/worker/delete/${id}`);
    return response.data;
  },

  getAllWorkers: async () => {
    const response = await api.get('/worker/getAll');
    return response.data;
  },

  getWorkerByProfession: async (profession) => {
    const response = await api.get(`/worker/getByProfession/${profession}`);
    return response.data;
  },

  getNearbyWorkers: async (latitude, longitude, radius, profession) => {
    const response = await api.get('/worker/getNearbyWorkers', {
      params: { latitude, longitude, radius, profession },
    });
    return response.data;
  },

  approveWorker: async (id) => {
    const response = await api.put(`/worker/approve/${id}`);
    return response.data;
  },
};

export default workerService;
