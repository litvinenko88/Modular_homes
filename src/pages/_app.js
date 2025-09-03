import '../styles/globals.css';
import Analytics from '../components/Analytics/Analytics';
import { handleError } from '../utils/errorHandler';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  // Глобальная обработка ошибок
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleGlobalError = (event) => {
        handleError(event.error, 'Global error handler');
      };

      const handleUnhandledRejection = (event) => {
        handleError(new Error(event.reason), 'Unhandled promise rejection');
      };

      window.addEventListener('error', handleGlobalError);
      window.addEventListener('unhandledrejection', handleUnhandledRejection);

      return () => {
        window.removeEventListener('error', handleGlobalError);
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      };
    }
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}