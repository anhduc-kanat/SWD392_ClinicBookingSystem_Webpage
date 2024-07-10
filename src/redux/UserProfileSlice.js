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
    return response.data.data; // Trả về toàn bộ mảng dữ liệu người dùng
  } catch (error) {
    console.error('Error fetching user profiles:', error.message);
    throw error;
  }
};


export default api;
