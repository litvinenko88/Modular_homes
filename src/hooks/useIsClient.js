import { useState, useEffect } from 'react';

/**
 * Хук для определения, выполняется ли код на клиенте
 * Помогает избежать ошибок гидратации при использовании браузерных API
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}