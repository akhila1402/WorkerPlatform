import api from '../api/api';

const problemService = {
  createProblem: async (problem) => {
    const response = await api.post('/problem/create', problem);
    return response.data;
  },

  getProblem: async (id) => {
    const response = await api.get(`/problem/get`, { params: { id } });
    return response.data;
  },

  updateStatus: async (id, status) => {
    // POST /problem/updateStatus with request params id and status
    const response = await api.post('/problem/updateStatus', null, {
      params: { id, status },
    });
    return response.data;
  },

  updateProblem: async (id, problem) => {
    // POST /problem/update with request param id and body problem
    const response = await api.post('/problem/update', problem, {
      params: { id },
    });
    return response.data;
  },

  getProblemsByStatus: async (status) => {
    const response = await api.get(`/problem/getByStatus`, { params: { status } });
    return response.data;
  },

  getAllProblems: async () => {
    const response = await api.get('/problem/getAll');
    return response.data;
  },

  getProblemsByUserId: async (userId) => {
    const response = await api.get(`/problem/getByUserId/${userId}`);
    return response.data;
  },

  getProblemsByCategory: async (category) => {
    const response = await api.get(`/problem/getByCategory/${category}`);
    return response.data;
  },

  getAvailableProblems: async () => {
    const response = await api.get('/problem/available');
    return response.data;
  },
};

export default problemService;
