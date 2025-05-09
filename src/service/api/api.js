import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const PackageService = {
  // Get all packages with optional status filter
  getPackages: async (status = null) => {
    const params = status ? { status } : {};
    const response = await api.get('/packages/', { params });
    return response.data;
    console.log("the error",response.data)
  },

  // Get package by ID
  getPackage: async (id) => {
    const response = await api.get(`/packages/${id}/`);
    return response.data;
  },

  // Create new package
  createPackage: async (packageData) => {
    const response = await api.post('/packages/', packageData);
    return response.data;
  },

  // Mark package as picked
  pickPackage: async (id, pickerData) => {
    const response = await api.post(`/packages/${id}/pick/`, pickerData);
    return response.data;
  },

  // Get package statistics
  getStats: async () => {
    const response = await api.get('/packages/stats/');
    return response.data;
  },
};