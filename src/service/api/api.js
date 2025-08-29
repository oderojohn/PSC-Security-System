import axios from 'axios';

const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:8000/api/`;
// const API_BASE_URL = `https://localhost:8000/api/`;


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
    const response = await api.get('/packages/', {
      params: {
        ...params,
        status: 'picked',
        time_range: 'today'
      }
    });
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
    console.log("this is use3r data from sewrver ", user)
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
  // 🔹 Lost Items
  getLostItems: async (params = {}) => {
    const response = await api.get('items/lost/', { params });
    return response.data;
  },
  getLostCards: async (params = {}) => {
    const response = await api.get('items/lost/', {
      params: { ...params, type: 'card' }
    });
    return response.data;
  },
  getLostNonCards: async (params = {}) => {
    const response = await api.get('items/lost/', {
      params: { ...params, type: 'item' }
    });
    return response.data;
  },

  getPotentialMatchesForLostItem: async () => {
    const response = await api.get(`/items/found/generate_matches/`);
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

  // 🔹 Found Items
  getFoundItems: async (params = {}) => {
    const response = await api.get('/items/found/', { params });
    return response.data;
  },
  getFoundCards: async (params = {}) => {
    const response = await api.get('/items/found/', {
      params: { ...params, type: 'card' }
    });
    return response.data;
  },
  getFoundNonCards: async (params = {}) => {
    const response = await api.get('/items/found/', {
      params: { ...params, type: 'item' }
    });
    return response.data;
  },

  getPotentialMatchesForFoundItem: async (itemId) => {
    const response = await api.get(`/items/found/generate_matches/`);
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

  // 🔹 Reports
  getFoundWeeklyReport: async (weeks = 2) => {
    const response = await api.get(`/items/found/weekly_report/`, {
      params: { weeks }
    });
    return response.data;
  },

  // 🔹 Pickups
  getRecentPickups: async () => {
    try {
      const response = await api.get('/items/pickuplogs/pickuphistory/');
      console.log('Recently picked items data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent pickups:', error);
      throw error;
    }
  }
};

// API Service for all endpoints
export const PhoneIssuesAPI = {
  // Phone Extensions
  getPhoneExtensions: async () => {
    const response = await api.get('phone-extensions/');
    return response.data;
  },
  createPhoneExtension: async (data) => {
    const response = await api.post('phone-extensions/', data);
    return response.data;
  },
  getPhoneExtension: async (id) => {
    const response = await api.get(`phone-extensions/${id}/`);
    return response.data;
  },
  updatePhoneExtension: async (id, data) => {
    const response = await api.put(`phone-extensions/${id}/`, data);
    return response.data;
  },
  deletePhoneExtension: async (id) => {
    await api.delete(`phone-extensions/${id}/`);
  },

  // Reported Issues
  getIssues: async (params = {}) => {
    const response = await api.get('issues/', { params });
    return response.data;
  },
  createIssue: async (data) => {
    console.log("issue data ", data)
    const response = await api.post('issues/', data);
    return response.data;
  },
  getIssue: async (id) => {
    const response = await api.get(`issues/${id}/`);
    return response.data;
  },
  updateIssue: async (id, data) => {
    const response = await api.put(`issues/${id}/`, data);
    return response.data;
  },
  updateIssueStatus: async (id, status) => {
    const response = await api.patch(`issues/${id}/status/`, { status });
    return response.data;
  },
  deleteIssue: async (id) => {
    await api.delete(`issues/${id}/`);
  },

  // Security Keys
  getSecurityKeys: async (searchQuery = '') => {
    const params = searchQuery ? { search: searchQuery } : {};
    const response = await api.get('security-keys/', { params });
    return response.data;
  },
  getSecurityKey: async (id) => {
    const response = await api.get(`security-keys/${id}/`);
    return response.data;
  },
  checkoutKey: async (id, holderData) => {
    console.log("checkout ",holderData)
    const response = await api.put(`security-keys/${id}/checkout/`, holderData);
    return response.data;
  },
  returnKey: async (id, returnData = {}) => {
    // If return_time not provided, server will use current time
    const response = await api.put(`security-keys/${id}/return/`, returnData);
    return response.data;
  },
  createSecurityKey: async (keyData) => {
  console.log("checkout ",keyData)
  const response = await api.post('security-keys/', keyData);
  return response.data;

},
getKeyHistory: async (id) => {
  const response = await api.get(`security-keys/${id}/history/`);
  return response.data;
},

 
};