import { useEffect, useState } from 'react';

import { useValuesStore } from 'store/useValuesStore';

import { Direction, Trade } from './types';
import { priceChangeDirection } from './helpers';

export const {
  VITE_BINANCE_API_KEY: BINANCE_API_KEY,
  VITE_BINANCE_API_SECRET: BINANCE_API_SECRET,
  VITE_BINANCE_API_URL: BINANCE_API_URL,
} = import.meta.env;

export const READY_STATE = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];

const coin = 'BTCTUSD';
const url = `wss://stream.binance.com:9443/ws/${coin.toLowerCase()}@trade`;

export const useBinance = () => {
  const { addValue } = useValuesStore();

  const [price, setPrice] = useState(-1);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [trade, setTrade] = useState<Trade | null>(null);
  const [direction, setDirection] = useState<Direction>(Direction.NONE);

  const close = () => {
    if (socket) {
      socket.close();
    }
  };

  const onOpen = () => {
    console.log('Connected to Binance');
  };

  const onMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);

    const { p: price, q: quantity, a: seller, b: buyer } = data;

    setPrice((prevPrice) => {
      setDirection(() => priceChangeDirection({ prevPrice, price }));

      return price;
    });

    setTrade(() => ({ p: price, q: quantity }));

    addValue(price * quantity);

    if (buyer === 3257517519 || seller === 3257517519) {
      // TODO: remove!
      // eslint-disable-next-line no-console
      console.log('%c 3257517519 ', 'color: black; background-color: yellow', {
        price,
        quantity,
        value: price * quantity,
        time: new Date(data.T).toLocaleTimeString(),
        direction,
        seller,
        buyer,
      });
    }

    if (buyer === 3257646791 || seller === 3257646791) {
      // TODO: remove!
      // eslint-disable-next-line no-console
      console.log('%c 3257646791 ', 'color: black; background-color: yellow', {
        price,
        quantity,
        value: price * quantity,
        time: new Date(data.T).toLocaleTimeString(),
        direction,
        seller,
        buyer,
      });
    }

    if (price * quantity > 10000) {
      // TODO: remove!
      // eslint-disable-next-line no-console
      console.log('%c  ', 'color: black; background-color: yellow', {
        price,
        quantity,
        value: price * quantity,
        time: new Date(data.T).toLocaleTimeString(),
        direction,
        seller,
        buyer,
      });
    }
  };

  useEffect(() => {
    const endpoint = '/api/v3/ticker/price';
    fetch(`${BINANCE_API_URL}${endpoint}?symbol=${coin}`, {
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
      onOpen();
    };

    return () => {
      ws.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    close,
    direction,
    price,
    readyState: socket?.readyState,
    trade,
  };
};
