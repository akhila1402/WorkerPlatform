import api from '../api/api';

const authService = {
  signup: async (user) => {
    const response = await api.post('/auth/signup', user);
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data; // Returns { token, type, id, email, role, profileCompleted }
  },

  loginWithGoogle: async (idToken, registrationType) => {
    const response = await api.post('/auth/google', { idToken, registrationType });
    return response.data; // Returns { token, type, id, email, role, profileCompleted }
  },
};

export default authService;
