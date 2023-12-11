import { useEffect } from 'react';
import { useIntl } from 'react-intl';

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
    isFetching,
    lowestSwing,
    swings,
  } = useFutures();
  const { formatNumber } = useIntl();

  useEffect(() => {
    getCandleByPeriod();
  }, []);

  useEffect(() => {
    if (data) {
      getSwings(2);
    }
  }, [data]);

  useEffect(() => {
    if (swings) {
      // TODO: remove!
      // eslint-disable-next-line no-console
      console.log('%c with swings: ', 'color: black; background-color: yellow', {
        candles,
        swings,
      });
    }
  }, [swings]);

  /*
  useEffect(() => {
    if (!isEmpty(lowestSwing)) {
      // TODO: remove!
      // eslint-disable-next-line no-console
      console.log('%c lowestSwing: ', 'color: black; background-color: yellow', { lowestSwing });
    }
  }, [lowestSwing]);
*/

  useEffect(() => {
    if (highestSwing !== undefined && highestSwing !== null) {
      checkTrend(highestSwing?.openT);
    }
  }, [highestSwing]);

  useEffect(() => {
    if (candle) {
      // TODO: remove!
      // eslint-disable-next-line no-console
      console.log('%c candle: ', 'color: black; background-color: yellow', { candle });
    }
  }, [candle]);

  return (
    <>
      <h3 style={{ textAlign: 'start' }}>Futures</h3>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
        <button type="button" onClick={() => getCandleByPeriod()} disabled={isFetching}>
          Refresh
        </button>
      </div>

      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Date, time</th>
            <th>Price</th>
            <th>Trend</th>
          </tr>
        </thead>
        <tbody>
          <tr
            style={{
              color: `${Number(candles?.[0]?.close) > Number(candles?.[0]?.open) ? 'green' : ''}${
                Number(candles?.[0]?.close) < Number(candles?.[0]?.open) ? 'red' : ''
              }${Number(candles?.[0]?.close) === Number(candles?.[0]?.open) ? 'blue' : ''}`,
            }}
          >
            <td style={{ textAlign: 'start' }}>First candle:</td>
            <td>{candles?.[0]?.openTime}</td>
            <td></td>
            <td></td>
          </tr>
          <tr
            style={{
              color: `${swings?.[0]?.isSwingHigh && !swings?.[0]?.isSwingLow ? 'green' : ''}${
                swings?.[0]?.isSwingLow && !swings?.[0]?.isSwingHigh ? 'red' : ''
              }${swings?.[0]?.isSwingLow && swings?.[0]?.isSwingHigh ? 'blue' : ''}`,
            }}
          >
            <td style={{ textAlign: 'start' }}>First swing:</td>
            <td>{swings?.[0]?.openTime}</td>
            <td>
              {swings?.[0]?.isSwingHigh && (
                <div>{`${formatNumber(swings?.[0]?.high, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}</div>
              )}
              {swings?.[0]?.isSwingLow &&
                `${formatNumber(swings?.[0]?.low, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
            </td>
            <td>
              {swings?.[0]?.isSwingHigh && <div>{'high'}</div>}
              {swings?.[0]?.isSwingLow && <div>{'low'}</div>}
            </td>
          </tr>
          <tr style={{ color: 'red' }}>
            <td style={{ textAlign: 'start' }}>Lowest swing:</td>
            <td>{lowestSwing?.openTime}</td>
            <td>
              {!!lowestSwing && (
                <div>{`${formatNumber(lowestSwing.low, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}</div>
              )}
            </td>
            <td>{!!lowestSwing && <div>{'low'}</div>}</td>
          </tr>
          <tr style={{ color: 'green' }}>
            <td style={{ textAlign: 'start' }}>Highest swing:</td>
            <td>{highestSwing?.openTime}</td>
            <td>
              {!!highestSwing &&
                `${formatNumber(highestSwing?.high, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
            </td>
            <td>{!!highestSwing && <div>{'high'}</div>}</td>
          </tr>
          <tr
            style={{
              color: `${
                swings?.[swings.length - 1]?.isSwingHigh && !swings?.[swings.length - 1]?.isSwingLow
                  ? 'green'
                  : ''
              }${
                swings?.[swings.length - 1]?.isSwingLow && !swings?.[swings.length - 1]?.isSwingHigh
                  ? 'red'
                  : ''
              }${
                swings?.[swings.length - 1]?.isSwingLow && swings?.[swings.length - 1]?.isSwingHigh
                  ? 'blue'
                  : ''
              }`,
            }}
          >
            <td style={{ textAlign: 'start' }}>Last swing:</td>
            <td>{swings?.[swings.length - 1]?.openTime}</td>
            <td>
              {swings?.[swings.length - 1]?.isSwingHigh &&
                `${formatNumber(swings?.[swings.length - 1]?.high, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
              {swings?.[swings.length - 1]?.isSwingLow &&
                `${formatNumber(swings?.[swings.length - 1]?.low, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
            </td>
            <td>
              {swings?.[swings.length - 1]?.isSwingHigh && <div>{'high'}</div>}
              {swings?.[swings.length - 1]?.isSwingLow && <div>{'low'}</div>}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
