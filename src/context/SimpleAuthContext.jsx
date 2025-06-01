import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  // Fonctions simplifiées
  const login = async (email, _password) => {
    void _password;
    setUser({ id: '1', email, profile: { role: 'client' } });
    return { data: { user: { id: '1', email } }, error: null };
  };
  
  const logout = async () => {
    setUser(null);
    return { error: null };
  };
  
  const checkUser = () => {
    // Ne fait rien dans cette version simplifiée
  };
  
  const value = {
    user,
    loading: false,
    login,
    logout,
    checkUser,
    isAdmin: false,
    register: async () => ({ data: {}, error: null }),
    resetPassword: async () => ({ error: null }),
    updatePassword: async () => ({ error: null }),
    updateProfile: async () => ({ error: null })
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
