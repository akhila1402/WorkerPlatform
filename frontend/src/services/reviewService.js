import api from '../api/api';

const reviewService = {
  createReview: async (review) => {
    // review has: userId, workerId, problemId, rating, reviewText
    const response = await api.post('/review/create', review);
    return response.data;
  },

  updateReview: async (id, review) => {
    const response = await api.post('/review/update', review, {
      params: { id },
    });
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await api.post('/review/delete', null, {
      params: { id },
    });
    return response.data;
  },

  getReviewsByWorker: async (workerId) => {
    const response = await api.get(`/review/worker/${workerId}`);
    return response.data;
  },
};

export default reviewService;
