import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearStoredUser, getStoredUser, setStoredUser } from './authStore';
import { me } from './api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) { setIsBooting(false); return; }
    me().then(({ user }) => {
      setUser(user);
      setStoredUser(user);
    }).catch(() => {
      clearStoredUser();
      setUser(null);
    }).finally(() => setIsBooting(false));
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isBooting,
    login: (nextUser) => { setUser(nextUser); setStoredUser(nextUser); },
    logout: () => { clearStoredUser(); setUser(null); },
  }), [user, isBooting]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
