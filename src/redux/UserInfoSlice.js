import axios from 'axios';
import { createSlice } from '@reduxjs/toolkit';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const fetchUserInfo  = async (accessToken) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/my-profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error('Failed to fetch user profile');
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export { fetchUserInfo };
