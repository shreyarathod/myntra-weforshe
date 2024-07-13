import axiosInstance from './axiosInstance';

export const register = async (formData) => {
  try {
    const response = await axiosInstance.post('users/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const login = async (formData) => {
  try {
    const response = await axiosInstance.post('users/login', formData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
