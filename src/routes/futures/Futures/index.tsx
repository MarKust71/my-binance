import { useEffect } from 'react';
import { FuturesCandles } from 'src/routes/futures/Futures/FuturesCandles';

import { useFutures } from 'hooks/useFutures';

export const Futures = () => {
  const { data, getCandleByPeriod, getTradeList, getRecentTrades, getSwings } = useFutures();

  useEffect(() => {
    getCandleByPeriod();
    getTradeList({
      symbol: 'BTCUSDT',
      limit: 1000,
      startTime: new Date('2023-12-14T18:39:00.000'),
      endTime: new Date('2023-12-14T18:39:33.000'),
    });
    getRecentTrades();
  }, []);

  useEffect(() => {
    if (data) {
      getSwings(2);
    }
  }, [data]);

  /*
  useEffect(() => {
    if (!isEmpty(lowestSwing)) {
      // TODO: remove!
      // eslint-disable-next-line no-console
      console.log('%c lowestSwing: ', 'color: black; background-color: yellow', { lowestSwing });
    }
  }, [lowestSwing]);
*/

  /*
  useEffect(() => {
    if (highestSwing !== undefined && highestSwing !== null) {
      checkTrend(highestSwing?.openT);
    }
  }, [highestSwing]);
*/

  return (
    <>
      <h3 style={{ textAlign: 'start' }}>Futures</h3>

      <FuturesCandles />
    </>
  );
};
