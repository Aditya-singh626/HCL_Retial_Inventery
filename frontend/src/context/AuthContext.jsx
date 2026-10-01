import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  authApi,
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
  removeStoredToken,
  removeStoredUser
} from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Sync with storage on mount
    const savedToken = getStoredToken();
    const savedUser = getStoredUser();
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      setStoredToken(data.token);
      const userData = { id: data.id, name: data.name, email: data.email };
      setStoredUser(userData);
      setToken(data.token);
      setUser(userData);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await authApi.signup({ name, email, password });
      setStoredToken(data.token);
      const userData = { id: data.id, name: data.name, email: data.email };
      setStoredUser(userData);
      setToken(data.token);
      setUser(userData);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeStoredToken();
    removeStoredUser();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
