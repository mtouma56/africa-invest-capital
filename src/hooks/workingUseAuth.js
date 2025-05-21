import { useContext } from 'react';
import { AuthContext } from '../context/WorkingAuthContext';

export const useAuth = () => {
  return useContext(AuthContext);
};
