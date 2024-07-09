import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchUserProfile = async () => {
  try {
    const response = await api.get('/user-profile/get-profile-by-customer');
    return response.data.data[0];
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    throw error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/user-profile/update-profile', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error.message);
    throw error;
  }
};

export default api;
