import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/auth';
import { connectSocket, disconnectSocket } from '../services/socket';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await authAPI.getProfile();
      setUser(data.user || data);
    } catch {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  }, []);

  useEffect(() => {
    if (token) {
      connectSocket(token);
      fetchProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token, fetchProfile]);

  const login = async (email, password) => {
    const { data } = await authAPI.login(email, password);
    localStorage.setItem('token', data.token);
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    setToken(data.token);
    setUser(data.user);
    connectSocket(data.token);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await authAPI.register(name, email, password);
    localStorage.setItem('token', data.token);
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    setToken(data.token);
    setUser(data.user);
    connectSocket(data.token);
    return data;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // logout even if API fails
    }
    disconnectSocket();
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data) => {
    const { data: updated } = await authAPI.updateProfile(data);
    setUser(updated.user || updated);
    return updated;
  };

  const refreshUser = async () => {
    await fetchProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
