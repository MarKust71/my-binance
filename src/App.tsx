import './App.css';

import { READY_STATE, useBinance } from './hooks/useBinance';

export const App = () => {
  const { price, readyState, close } = useBinance();

  const onStop = () => {
    close();
  };

  return (
    <>
      <h1>binance</h1>

      <p>{readyState === undefined ? 'undefined' : READY_STATE[readyState]}</p>

      <p>{price ? price : '***'}</p>

      <button onClick={onStop}>stop</button>

      <div>
        <button>BUY</button>

        <button>SELL</button>
      </div>
    </>
  );
};

export default App;
