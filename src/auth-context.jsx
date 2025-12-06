import { createContext, useState, useEffect, useCallback } from 'react';
import authService from './services/auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(() => {
    try {
      const token = localStorage.getItem('authToken');
      const userData = authService.getCurrentUser();
      if (token && userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials) => {
    try {
      const { user } = await authService.login(credentials);
      if (user) {
        setUser(user);
      }
      return { user };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated: !!user, 
      login, 
      logout 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};