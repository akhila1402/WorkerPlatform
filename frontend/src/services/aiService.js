import api from '../api/api';

const aiService = {
  enhanceDescription: async (description) => {
    // POST /ai/enhance-description
    // Request: { description }
    // Response: { enhancedDescription }
    const response = await api.post('/ai/enhance-description', { description });
    return response.data;
  },

  analyseApplications: async (problemId) => {
    // POST /ai/analyse-applications
    // Request: { problemId }
    // Response: { workerId, workerName, reason }
    const response = await api.post('/ai/analyse-applications', { problemId });
    return response.data;
  },
};

export default aiService;
