import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });
        
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login/', { username, password });
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },
  
  logout: async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) {
      try {
        await api.post('/auth/logout/', { refresh });
      } catch (e) {
        console.error('Logout error:', e);
      }
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/me/');
    return response.data;
  },
  
  updateProfile: async (data) => {
    const response = await api.patch('/auth/me/', data);
    return response.data;
  },
  
  changePassword: async (data) => {
    const response = await api.post('/auth/change-password/', data);
    return response.data;
  },
};

export const billboardService = {
  getAll: async (params = {}) => {
    const response = await api.get('/billboards/', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/billboards/${id}/`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/billboards/', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.patch(`/billboards/${id}/`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/billboards/${id}/`);
    return response.data;
  },
  
  getMyBillboards: async () => {
    const response = await api.get('/billboards/my_billboards/');
    return response.data;
  },
};

export const proposalService = {
  getAll: async (params = {}) => {
    const response = await api.get('/proposals/', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/proposals/${id}/`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/proposals/', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.patch(`/proposals/${id}/`, data);
    return response.data;
  },
  
  submit: async (id) => {
    const response = await api.post(`/proposals/${id}/submit/`);
    return response.data;
  },
  
  cancel: async (id) => {
    const response = await api.post(`/proposals/${id}/cancel/`);
    return response.data;
  },
  
  getMyProposals: async () => {
    const response = await api.get('/proposals/my_proposals/');
    return response.data;
  },
  
  getBids: async (id) => {
    const response = await api.get(`/proposals/${id}/bids/`);
    return response.data;
  },
};

export const bidService = {
  getAll: async (params = {}) => {
    const response = await api.get('/bids/', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/bids/${id}/`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/bids/', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.patch(`/bids/${id}/`, data);
    return response.data;
  },
  
  accept: async (id) => {
    const response = await api.post(`/bids/${id}/accept/`);
    return response.data;
  },
  
  reject: async (id) => {
    const response = await api.post(`/bids/${id}/reject/`);
    return response.data;
  },
  
  withdraw: async (id) => {
    const response = await api.post(`/bids/${id}/withdraw/`);
    return response.data;
  },
  
  getMyBids: async () => {
    const response = await api.get('/bids/my_bids/');
    return response.data;
  },
  
  getReceivedBids: async () => {
    const response = await api.get('/bids/received_bids/');
    return response.data;
  },
  
  getMessages: async (id) => {
    const response = await api.get(`/bids/${id}/messages/`);
    return response.data;
  },
  
  sendMessage: async (id, message) => {
    const response = await api.post(`/bids/${id}/messages/`, { message });
    return response.data;
  },
};

export default api;
