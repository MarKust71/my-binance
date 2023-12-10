import { useEffect } from 'react';
import { isEmpty } from 'lodash';

import { useFutures } from 'hooks/useFutures';

export const Futures = () => {
  const {
    candle,
    candles,
    checkTrend,
    data,
    getCandleByPeriod,
    getSwings,
    highestSwing,
    lowestSwing,
    swings,
  } = useFutures();

  useEffect(() => {
    getCandleByPeriod();
  }, []);

  useEffect(() => {
    if (!isEmpty(data)) {
      getSwings(2);
    }
  }, [data]);

  useEffect(() => {
    if (!isEmpty(swings)) {
      // TODO: remove!
      // eslint-disable-next-line no-console
      console.log('%c with swings: ', 'color: black; background-color: yellow', {
        candles,
        swings,
      });
    }
  }, [swings]);

  useEffect(() => {
    if (!isEmpty(lowestSwing)) {
      // TODO: remove!
      // eslint-disable-next-line no-console
      console.log('%c lowestSwing: ', 'color: black; background-color: yellow', { lowestSwing });
    }
  }, [lowestSwing]);

  useEffect(() => {
    if (!isEmpty(highestSwing)) {
      // TODO: remove!
      // eslint-disable-next-line no-console
      console.log('%c highestSwing: ', 'color: black; background-color: yellow', { highestSwing });

      checkTrend(highestSwing?.openT);
    }
  }, [highestSwing]);

  useEffect(() => {
    if (!isEmpty(candle)) {
      // TODO: remove!
      // eslint-disable-next-line no-console
      console.log('%c candle: ', 'color: black; background-color: yellow', { candle });
    }
  }, [candle]);

  return (
    <>
      <h3 style={{ textAlign: 'start' }}>Futures</h3>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginTop: '8px' }}>First candle:</div>
        <div>{candles?.[0]?.openTime}</div>

        <div style={{ marginTop: '8px' }}>First swing:</div>
        <div>{swings?.[0]?.openTime}</div>
        {swings?.[0]?.isSwingHigh && <div>{`high: ${swings?.[0]?.high}`}</div>}
        {swings?.[0]?.isSwingLow && <div>{`low: ${swings?.[0]?.low}`}</div>}

        <div style={{ marginTop: '8px' }}>Lowest swing:</div>
        <div>{lowestSwing?.openTime}</div>
        <div>{`low: ${lowestSwing?.low}`}</div>

        <div style={{ marginTop: '8px' }}>Highest swing:</div>
        <div>{highestSwing?.openTime}</div>
        <div>{`high: ${highestSwing?.high}`}</div>

        <div style={{ marginTop: '8px' }}>Last swing:</div>
        <div>{swings?.[swings.length - 1]?.openTime}</div>
        {swings?.[swings.length - 1]?.isSwingHigh && (
          <div>{`high: ${swings?.[swings.length - 1]?.high}`}</div>
        )}
        {swings?.[swings.length - 1]?.isSwingLow && (
          <div>{`low: ${swings?.[swings.length - 1]?.low}`}</div>
        )}
      </div>
    </>
  );
};
