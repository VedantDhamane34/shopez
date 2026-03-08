import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Rehydrate from localStorage on app load
    const token    = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    if (token && userInfo) {
      try { setUser(JSON.parse(userInfo)); } catch { logout(); }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // userData = { _id, username, email, usertype, token }
    localStorage.setItem('token',    userData.token);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  const isAdmin = user?.usertype === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
