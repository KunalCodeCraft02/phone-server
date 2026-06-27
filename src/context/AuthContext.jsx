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
      const res = await authAPI.getProfile();
      const profileData = res.data?.data || res.data?.user || res.data;
      setUser(profileData);
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
    const res = await authAPI.login(email, password);
    const payload = res.data?.data || res.data;
    const accessToken = payload.accessToken || payload.token;
    const refreshToken = payload.refreshToken;
    const userData = payload.user;

    localStorage.setItem('token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    setToken(accessToken);
    setUser(userData);
    connectSocket(accessToken);
    return payload;
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register(name, email, password);
    const payload = res.data?.data || res.data;
    const accessToken = payload.accessToken || payload.token;
    const refreshToken = payload.refreshToken;
    const userData = payload.user;

    localStorage.setItem('token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    setToken(accessToken);
    setUser(userData);
    connectSocket(accessToken);
    return payload;
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
    const res = await authAPI.updateProfile(data);
    const updated = res.data?.data || res.data;
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
