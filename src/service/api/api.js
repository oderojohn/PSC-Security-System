import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/';

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccess = response.data.access;
        localStorage.setItem('access_token', newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
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

// PackageService
export const PackageService = {
  getPackages: async (params = {}) => {
    const response = await api.get('/packages/', { params: { ...params, status: 'pending' } });
    return response.data;
  },

  getPickedPackages: async (params = {}) => {
    const response = await api.get('/packages/', { params: { ...params, status: 'picked' } });
    return response.data;
  },

  createPackage: async (data) => {
    const response = await api.post('/packages/', data);
    return response.data;
  },

  updatePackage: async (id, data) => {
    const response = await api.put(`/packages/${id}/`, data);
    return response.data;
  },

  partialUpdatePackage: async (id, data) => {
    const response = await api.patch(`/packages/${id}/`, data);
    return response.data;
  },

  deletePackage: async (id) => {
    const response = await api.delete(`/packages/${id}/`);
    return response.data;
  },

  pickPackage: async (id, pickerData) => {
    const response = await api.post(`/packages/${id}/pick/`, pickerData);
    return response.data;
  },

  getStats: async (params = {}) => {
    const response = await api.get('/packages/stats/', { params });
    return response.data;
  },

  searchPackages: async (params = {}) => {
    const response = await api.get('/packages/', { params });
    return response.data;
  },

  exportPackages: async (params = {}) => {
    const response = await api.get('/packages/export/', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  getSummary: async (params = {}) => {
    const response = await api.get('/packages/summary/', { params });
    return response.data;
  },
};

// AuthService
export const AuthService = {
  login: async (credentials) => {
    console.log("this are login",credentials);
    const response = await api.post('/auth/login/', credentials);
    const { access, refresh, user } = response.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  },

  getEventLogs: async (params = {}) => {
    const response = await api.get('/auth/event-logs/', { params });
    return response.data;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    await api.post('/auth/logout/', { refresh: refreshToken });
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await api.post('/auth/token/refresh/', { refresh: refreshToken });
    localStorage.setItem('access_token', response.data.access);
    return response.data;
  }
};

// LostFoundService
export const LostFoundService = {
  getLostItems: async (params = {}) => {
    const response = await api.get('items/lost/', { params });
    return response.data;
  },

  getPotentialMatchesForLostItem: async () => {
    const response = await api.get(`/items/lost/potential_matches/`);
    return response.data;
  },

  createLostItem: async (data) => {
    const response = await api.post('/items/lost/', data);
    return response.data;
  },

  markAsFound: async (id) => {
    const response = await api.post(`/items/lost/${id}/mark_found/`);
    return response.data;
  },

  getFoundItems: async (params = {}) => {
    const response = await api.get('/items/found/', { params });
    return response.data;
  },

  getPotentialMatchesForFoundItem: async (itemId) => {
    const response = await api.get(`/items/lost/potential_matches/`);
    return response.data;
  },

  createFoundItem: async (data) => {
    const response = await api.post('/items/found/', data);
    return response.data;
  },

  pickFoundItem: async (id, pickerData) => {
    const response = await api.post(`/items/found/${id}/pick/`, pickerData);
    return response.data;
  },

  getFoundWeeklyReport: async (weeks = 2) => {
    const response = await api.get(`/items/found/weekly_report/`, {
      params: { weeks }
    });
    return response.data;
  }
};
