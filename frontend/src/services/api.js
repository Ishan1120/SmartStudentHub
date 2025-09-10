import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Student services
export const studentService = {
  getDashboard: () => api.get('/student/dashboard'),
  getProfile: () => api.get('/student/profile'),
  updateProfile: (data) => api.put('/student/profile', data),
  getPortfolio: (studentId) => 
    api.get(studentId ? `/student/portfolio/${studentId}` : '/student/portfolio'),
};

// Activity services
export const activityService = {
  getMyActivities: () => api.get('/activities/my-activities'),
  getActivity: (id) => api.get(`/activities/${id}`),
  createActivity: (data) => api.post('/activities', data),
  updateActivity: (id, data) => api.put(`/activities/${id}`, data),
  deleteActivity: (id) => api.delete(`/activities/${id}`),
  getStats: (studentId) => api.get(`/activities/stats/${studentId || ''}`),
};

// Faculty services
export const facultyService = {
  getPendingActivities: () => api.get('/faculty/pending-activities'),
  getAllActivities: (params) => api.get('/faculty/all-activities', { params }),
  approveActivity: (id, points) => api.put(`/faculty/approve/${id}`, { points }),
  rejectActivity: (id, reason) => api.put(`/faculty/reject/${id}`, { reason }),
  getStudents: () => api.get('/faculty/students'),
  getAnalytics: () => api.get('/faculty/analytics'),
};

export default api;
