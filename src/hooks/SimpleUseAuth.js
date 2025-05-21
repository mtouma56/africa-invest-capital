import { useContext } from 'react';
import { AuthContext } from '../context/SimpleAuthContext';

export const useAuth = () => {
  return useContext(AuthContext);
};
