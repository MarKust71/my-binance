import { useCallback, useEffect, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db-hook';

import { useValuesStore } from 'store/useValuesStore';

import { Direction, Trade } from './types';
import { priceChangeDirection } from './helpers';

export const {
  VITE_BINANCE_API_KEY: BINANCE_API_KEY,
  VITE_BINANCE_API_SECRET: BINANCE_API_SECRET,
  VITE_BINANCE_API_URL: BINANCE_API_URL,
  VITE_BINANCE_FUTURES_API_URL: BINANCE_FUTURES_API_URL,
} = import.meta.env;

export const READY_STATE = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];

const coin = 'BTCUSDT';
const url = `wss://stream.binance.com:9443/ws/${coin.toLowerCase()}@trade`;

export const useBinance = () => {
  const { addValue } = useValuesStore();
  const db = useIndexedDB('ticks');

  const [price, setPrice] = useState(-1);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [trade, setTrade] = useState<Trade | null>(null);
  const [direction, setDirection] = useState<Direction>(Direction.NONE);
  const [readyState, setReadyState] = useState<WebSocket['readyState']>();

  const onOpen = (ws: WebSocket) => {
    setReadyState(() => ws.readyState);

    console.log('Connected to Binance');
  };

  const onClose = (ws: WebSocket) => {
    setReadyState(() => ws.readyState);

    console.log('Disconnected from Binance');
  };

  const onMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);

    db.add(data);

    const { p: price, q: quantity } = data;

    setPrice((prevPrice) => {
      setDirection(() => priceChangeDirection({ prevPrice, price }));

      return price;
    });

    setTrade(() => ({ p: price, q: quantity }));

    addValue(price * quantity);
  };

  const open = () => {
    const ENDPOINT = '/api/v3/ticker/price';
    fetch(`${BINANCE_API_URL}${ENDPOINT}?symbol=${coin}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => {
        setPrice(() => res.price);
      });

    const ws = new WebSocket(url);

    setSocket(() => ws);

    ws.onmessage = (event) => {
      onMessage(event);
    };

    ws.onopen = () => {
      onOpen(ws);
    };

    ws.onclose = () => {
      onClose(ws);
    };

    ws.onerror = (error) => {
      console.log(error);
    };
  };

  const close = useCallback(() => {
    if (socket) {
      socket.close();
    }
  }, [socket]);

  useEffect(() => {
    return () => {
      close();
    };
  }, []);

  useEffect(() => {
    setReadyState(() => socket?.readyState);
  }, [socket?.readyState]);

  return {
    close,
    direction,
    open,
    price,
    readyState,
    trade,
  };
};
