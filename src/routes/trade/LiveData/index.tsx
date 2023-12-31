import './styles.css';

import React, { useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { useIntl } from 'react-intl';
import { initDB } from 'react-indexed-db-hook';
import { indexedDBConfig } from 'src/db';

import { READY_STATE, useBinance } from 'hooks/useBinance';
import { Direction } from 'hooks/useBinance/types';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { useOrderStore } from 'store/useOrderStore';
import { OrderType } from 'store/useOrderStore/types';
import { useValuesStore } from 'store/useValuesStore';

initDB(indexedDBConfig);

export const LiveData = () => {
  const { formatNumber, formatDate, formatTime } = useIntl();
  const { price, readyState, close, trade, direction, open } = useBinance();
  const { orders, setNewOrder, addOrder, deleteOrder } = useOrderStore();
  const { saveOrders, loadOrders, isLoaded, saveValues } = useLocalStorage();
  const { values } = useValuesStore();

  const onDelete = (id: string) => {
    deleteOrder(id);
  };

  const onStart = () => {
    open();
  };

  const onStop = () => {
    close();
  };

  const onBuy = () => {
    const timestamp = Date.now();

    const amount = 635.8880784;

    setNewOrder({
      amount,
      btc: amount / price,
      id: uuid(),
      price,
      time: new Date(timestamp).toISOString(),
      timestamp,
      type: OrderType.BUY,
    });

    addOrder();
  };

  const onSell = () => {
    const timestamp = Date.now();

    const amount = 635.17966589;

    setNewOrder({
      amount,
      btc: amount / price,
      id: uuid(),
      price,
      time: new Date(timestamp).toISOString(),
      timestamp,
      type: OrderType.SELL,
    });

    addOrder();
  };

  useEffect(() => {
    if (isLoaded) {
      saveOrders();
    }
  }, [orders]);

  useEffect(() => {
    saveValues();
  }, [values]);

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <>
      <h1>binance</h1>

      <p>{readyState === undefined ? 'undefined' : READY_STATE[readyState]}</p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr 1fr 1fr',
          gap: '4px',
        }}
      >
        <p>
          {`${direction === Direction.DOWN ? '⬇' : ''}${direction === Direction.UP ? '⬆' : ''}${
            direction === Direction.NONE ? '➡️' : ''
          }`}
        </p>
        <p style={{ textAlign: 'right' }}>{`${
          price ? formatNumber(price, { minimumFractionDigits: 2 }) : '***'
        } BTC/USDT`}</p>
        <p style={{ textAlign: 'right' }}>{`${
          trade?.q ? formatNumber(trade.q, { minimumFractionDigits: 5 }) : '***'
        } BTC`}</p>
        <p style={{ textAlign: 'right' }}>{`${
          price && trade?.q ? formatNumber(trade.q * price, { minimumFractionDigits: 7 }) : '***'
        } USDT`}</p>
      </div>

      {readyState !== WebSocket.OPEN && <button onClick={onStart}>start</button>}

      {readyState === WebSocket.OPEN && <button onClick={onStop}>stop</button>}

      <div>
        <button
          onClick={onBuy}
          style={{ backgroundColor: 'green', color: 'white', margin: '0 2px' }}
        >
          BUY
        </button>

        <button
          onClick={onSell}
          style={{ backgroundColor: 'red', color: 'white', margin: '0 2px' }}
        >
          SELL
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr 1fr auto 1fr 1fr 1fr auto',
          gap: '4px',
        }}
      >
        <div style={{ fontSize: '14px' }}>{'Type'}</div>
        <div style={{ fontSize: '14px' }}>{'Date and time'}</div>
        <div style={{ fontSize: '14px' }}>{'BTC/TUSD order'}</div>
        <div style={{ fontSize: '14px' }}>{'TUSD amount'}</div>
        <div style={{ fontSize: '14px' }}>{'TUSD/BTC order'}</div>
        <div style={{ fontSize: '14px' }}>{'TUSD profit/loss'}</div>
        <div style={{ fontSize: '14px' }}>{'% profit/loss'}</div>
        <div style={{ fontSize: '14px' }}>{'Act'}</div>

        {orders.map((order) => {
          if (order) {
            const profitValue =
              (price - order.price) * order.btc * (order.type === OrderType.BUY ? 1 : -1);
            const profitPercent =
              (((price - order.price) * order.btc) / order.amount) *
              100 *
              (order.type === OrderType.BUY ? 1 : -1);
            const profitColor = (value: number) => {
              if (value > 0) {
                return 'green';
              }

              if (value < 0) {
                return 'red';
              }

              return 'black';
            };

            return (
              <React.Fragment key={order.id}>
                <div>{`${order.type}`}</div>

                <div>{`${formatDate(order.time)} ${formatTime(order.time)}`}</div>

                <div>
                  {formatNumber(order.price, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>

                <div>
                  {formatNumber(order.amount, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>

                <div>{formatNumber(order.btc, { minimumFractionDigits: 10 })}</div>

                <div style={{ color: profitColor(profitValue) }}>
                  {formatNumber(profitValue, {
                    minimumFractionDigits: 10,
                    signDisplay: 'always',
                  })}
                </div>

                <div style={{ color: profitColor(profitValue) }}>
                  {`${formatNumber(profitPercent, {
                    minimumFractionDigits: 6,
                    signDisplay: 'always',
                  })} %`}
                </div>

                <div style={{ cursor: 'pointer' }} onClick={() => onDelete(order.id)}>
                  ❌
                </div>
              </React.Fragment>
            );
          }
        })}
      </div>
    </>
  );
};
