import { useEffect, useState } from 'react';

export const {
  VITE_BINANCE_API_KEY: BINANCE_API_KEY,
  VITE_BINANCE_API_SECRET: BINANCE_API_SECRET,
  VITE_BINANCE_API_URL: BINANCE_API_URL,
} = import.meta.env;

export const READY_STATE = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];

const coin = 'BTCTUSD';
const url = `wss://stream.binance.com:9443/ws/${coin.toLowerCase()}@trade`;

export const useBinance = () => {
  const [price, setPrice] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const close = () => {
    if (socket) {
      socket.close();
    }
  };

  const onMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);

    setPrice(() => data.p);
  };

  useEffect(() => {
    const ws = new WebSocket(url);

    setSocket(() => ws);

    ws.onmessage = (event) => {
      onMessage(event);
    };

    return () => {
      ws.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    price,
    readyState: socket?.readyState,
    close,
  };
};
