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
            profile: userProfile,
          });
        } else {
          setUser(session.user);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction register - ordre des arguments : (fullName, email, password)
  const register = async (fullName, email, password) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password })
      })

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        return { data: null, error: new Error('Erreur serveur, contactez le support') }
      }

      let data
      try {
        data = await response.json()
      } catch {
        return { data: null, error: new Error('Erreur serveur, contactez le support') }
      }
      if (!response.ok) throw new Error(data.error || 'Registration failed')

      // Connexion automatique après inscription
      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({ email, password })
      if (loginError) throw loginError

      await checkUser()
      return { data: { user: data.user, loginData }, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      await checkUser();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      if (!user) throw new Error("Aucun utilisateur connecté");
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);
      if (error) throw error;
      await checkUser();
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

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

export default AuthProvider;
