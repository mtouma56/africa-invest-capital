import React, { createContext, useState, useCallback, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // États
  const [user, setUser] = useState(null);
  const [loading] = useState(false); // Commencez avec loading=false

  // Version simplifiée de checkUser qui évite les appels à Supabase
  const checkUser = useCallback(() => {
    // Ne fait rien pour l'instant
    console.log("Version simplifiée de checkUser appelée");
  }, []);

  // Fonctions mockées
  const login = async (email, _password) => {
    void _password;
    console.log("Login avec:", email);
    setUser({ email, profile: { role: email.includes('admin') ? 'admin' : 'client' } });
    return { data: {}, error: null };
  };

  const logout = async () => {
    setUser(null);
    return { error: null };
  };

  const register = async (email, _password, userDetails) => {
    void _password;
    console.log("Register avec:", email, userDetails);
    setUser({ 
      email, 
      profile: { 
        role: 'client',
        first_name: userDetails?.firstName || '',
        last_name: userDetails?.lastName || '',
        phone: userDetails?.phone || ''
      } 
    });
    return { data: {}, error: null };
  };

  // Autres fonctions mockées
  const resetPassword = async () => ({ error: null });
  const updatePassword = async () => ({ error: null });
  const updateProfile = async () => ({ error: null });

  // Pas d'appels à Supabase dans useEffect
  useEffect(() => {
    console.log("HybridAuthContext monté");
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    resetPassword,
    updatePassword,
    updateProfile,
    checkUser,
    isAdmin: user?.profile?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
