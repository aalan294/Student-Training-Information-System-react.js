import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3500';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Check if the request is for student endpoints
    const isStudentEndpoint = config.url.startsWith('/student');
    
    // Get the appropriate token based on the endpoint
    const token = isStudentEndpoint 
      ? localStorage.getItem('studentToken')
      : localStorage.getItem('adminToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // For form-data requests, remove Content-Type to let browser set it
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear the appropriate token and data based on the endpoint
      const isStudentEndpoint = error.config.url.startsWith('/student');
      if (isStudentEndpoint) {
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentData');
        window.location.href = '/student/login';
      } else {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const loginAdmin = (credentials) => api.post('/admin/login', credentials);
export const registerAdmin = (adminData) => api.post('/admin/register', adminData);
export const loginStudent = (credentials) => api.post('/student/login', credentials);

// Student APIs
export const getAllStudents = () => {
  return api.get('/admin/students');
};
export const registerStudent = (studentData) => api.post('/admin/register-student', studentData);
export const bulkRegisterStudents = (file, batch, passoutYear, department) => {
  const formData = new FormData();
  formData.append('excel', file);
  formData.append('batch', batch);
  formData.append('passoutYear', passoutYear);
  formData.append('department', department);
  
  return api.post('/admin/bulk-register', formData);
};

// Training Module APIs
export const getAllModules = () => api.get('/admin/modules');
export const addModule = async (moduleData) => {
  return api.post('/admin/modules', moduleData);
};
export const updateModule = (moduleId, moduleData) => api.put(`/admin/modules/${moduleId}`, moduleData);
export const getStudentModules = () => api.get('/student/modules');
export const getModuleStudents = (moduleId) => api.get(`/admin/students/module/${moduleId}`);

export const getStudentDetails = async (studentId) => {
  const response = await api.get(`/student/${studentId}`);
  return response.data;
};

export const getStudentModulePerformance = async (studentId, moduleId) => {
  const response = await api.get(`/student/${studentId}/module/${moduleId}`);
  return response.data;
};

export const uploadBulkScores = async (file, moduleId, examNumber) => {
  try {
    const formData = new FormData();
    formData.append('marksFile', file);
    formData.append('moduleId', moduleId);
    formData.append('examNumber', examNumber);
    // Do NOT set Content-Type header manually!
    return await api.post('/admin/upload-scores', formData);
  } catch (error) {
    console.error('Bulk score upload error:', error);
    throw error;
  }
};

export const uploadIndividualScore = async (studentId, moduleId, examNumber, score) => {
  const response = await api.post('/admin/upload-score', {
    studentId,
    moduleId,
    examNumber,
    score
  });
  return response.data;
};

export const deleteStudent = (studentId) => {
  return api.delete(`/admin/student/${studentId}`);
};

// Student Dashboard APIs
export const getStudentProfile = () => {
  const studentData = JSON.parse(localStorage.getItem('studentData'));
  if (!studentData?._id) {
    return Promise.reject(new Error('Student data not found'));
  }
  return api.get(`/student/${studentData._id}`);
};

export const getStudentModuleDetails = (moduleId) => {
  const studentData = JSON.parse(localStorage.getItem('studentData'));
  if (!studentData?._id) {
    return Promise.reject(new Error('Student data not found'));
  }
  return api.get(`/student/${studentData._id}/module/${moduleId}`);
};

// Admin Attendance and Module Update APIs
export const updateAttendance = (data) => api.post('/admin/attendance', data);
export const updateModuleDetails = (moduleId, data) => api.put(`/admin/modules/${moduleId}`, data);

// Mark module as completed
export const markModuleAsCompleted = async (moduleId) => {
  const response = await api.put(`/admin/modules/${moduleId}/complete`, {});
  return response.data;
};

export default api;
