import '../src/index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../src/context/AuthContext';

export default function MyApp({ Component, pageProps }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </BrowserRouter>
  );
}
