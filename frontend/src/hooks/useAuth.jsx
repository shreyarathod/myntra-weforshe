import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axiosInstance.get('/users/current-user');
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await axiosInstance.post('/users/logout');
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { isAuthenticated, logout };
}
