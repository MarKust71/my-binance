import { useIntl } from 'react-intl';

import { useFutures } from 'hooks/useFutures';
import { useFuturesStore } from 'store/useFuturesStore';

export const FuturesCandles = () => {
  const { candles, swings, isFetching, highestSwing, lowestSwing } = useFuturesStore();

  const { getCandleByPeriod } = useFutures();
  const { formatNumber } = useIntl();

  return (
    <>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
        <button type="button" onClick={() => getCandleByPeriod()} disabled={isFetching}>
          Refresh candles
        </button>
      </div>

      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Date, time</th>
            <th>Price</th>
            <th>High/Low</th>
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
              color: `${swings?.[0]?.close > swings?.[0]?.open ? 'green' : ''}${
                swings?.[0]?.close < swings?.[0]?.open ? 'red' : ''
              }${swings?.[0]?.close === swings?.[0]?.open ? 'blue' : ''}`,
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
              {swings?.[0]?.isSwingLow && (
                <div>{`${formatNumber(swings?.[0]?.low, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}</div>
              )}
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
              {!!highestSwing && (
                <div>{`${formatNumber(highestSwing?.high, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}</div>
              )}
            </td>
            <td>{!!highestSwing && <div>{'high'}</div>}</td>
          </tr>

          <tr
            style={{
              color: `${
                swings?.[swings.length - 1]?.close > swings?.[swings.length - 1]?.open
                  ? 'green'
                  : ''
              }${
                swings?.[swings.length - 1]?.close < swings?.[swings.length - 1]?.open ? 'red' : ''
              }${
                swings?.[swings.length - 1]?.close === swings?.[swings.length - 1]?.open
                  ? 'blue'
                  : ''
              }`,
            }}
          >
            <td style={{ textAlign: 'start' }}>Last swing:</td>
            <td>{swings?.[swings.length - 1]?.openTime}</td>
            <td>
              {swings?.[swings.length - 1]?.isSwingHigh && (
                <div>{`${formatNumber(swings?.[swings.length - 1]?.high, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}</div>
              )}
              {swings?.[swings.length - 1]?.isSwingLow && (
                <div>{`${formatNumber(swings?.[swings.length - 1]?.low, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}</div>
              )}
            </td>
            <td style={{ display: 'flex', flexDirection: 'column' }}>
              {swings?.[swings.length - 1]?.isSwingHigh && <div>{'high'}</div>}
              {swings?.[swings.length - 1]?.isSwingLow && <div>{'low'}</div>}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
