// frontend/src/hooks/usePriceWebSocket.js
import { useState, useEffect } from 'react';

export const usePriceWebSocket = (url) => {
  const [ticker, setTicker] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTicker(data);
    };

    // Cleanup function runs on unmount to close connection[cite: 1, 5]
    return () => {
      ws.close();
    };
  }, [url]);

  return ticker;
};