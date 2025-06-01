import { createContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const checkUser = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (userProfile) {
          setUser({
            ...session.user,
            profile: userProfile
          });
        } else {
          setUser(session.user);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'utilisateur:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Copier ici toutes les fonctions de votre AuthContext original
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      await checkUser();
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };
  
  // Ajoutez toutes vos autres fonctions (register, logout, etc.)
  // Copiez-les de votre AuthContext original
  
  useEffect(() => {
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          checkUser();
        }
      }
    );
    
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [checkUser]);

  const value = {
    user,
    loading,
    login,
    logout: async () => {
      try {
        await supabase.auth.signOut();
        setUser(null);
        return { error: null };
      } catch (error) {
        return { error };
      }
    },
    register: async (email, _password, _userDetails) => {
      void email;
      void _password;
      void _userDetails;
      // Ajoutez votre code de register ici
      return { data: {}, error: null };
    },
    resetPassword: async () => ({ error: null }),
    updatePassword: async () => ({ error: null }),
    updateProfile: async () => ({ error: null }),
    checkUser,
    isAdmin: user?.profile?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
