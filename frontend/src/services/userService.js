import api from '../api/api';

const userService = {
  getUser: async (id) => {
    const response = await api.get(`/user/get?id=${id}`);
    return response.data;
  },

  updateUser: async (user) => {
    const response = await api.put('/user/update', user);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/user/delete/${id}`);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/user/getAll');
    return response.data;
  },

  countUsers: async () => {
    const response = await api.get('/user/count');
    return response.data;
  },
};

export default userService;
