/* eslint-disable camelcase */
import Binance from 'binance-api-node';
import { useEffect, useState } from 'react';

const { VITE_BINANCE_API_KEY: api_key, VITE_BINANCE_API_SECRET: api_secret } = import.meta.env;

export const useBinance = () => {
  const [curDayClose, setCurDayClose] = useState('');

  const binanceClient = Binance({
    apiKey: api_key,
    apiSecret: api_secret,
  });

  const binanceClientWSClean = binanceClient.ws.miniTicker('BTCTUSD', (miniTicker) => {
    setCurDayClose(miniTicker.curDayClose);
  });

  useEffect(() => {
    return () => {
      binanceClientWSClean();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAccountInfo = async () => {
    return await binanceClient.accountInfo();
  };

  return {
    binanceClient,
    binanceClientWSClean,
    curDayClose,
    getAccountInfo,
  };
};
