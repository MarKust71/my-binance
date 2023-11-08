import './App.css';
import { useState } from 'react';

import { useBinance } from './hooks/useBinance';

export const App = () => {
  const { binanceClientWSClean, curDayClose, getAccountInfo } = useBinance();

  const [isRunning, setIsRunning] = useState(true);

  const onStart = () => {
    setIsRunning(true);
  };

  const onStop = () => {
    binanceClientWSClean();

    setIsRunning(false);
  };

  const onAccount = () => {
    getAccountInfo().then((info) => console.log(info));
  };

  return (
    <>
      <p>{isRunning ? curDayClose : ''}</p>

      {isRunning ? <button onClick={onStop}>stop</button> : false}

      {!isRunning ? <button onClick={onStart}>start</button> : false}

      <button onClick={onAccount}>account</button>
    </>
  );
};

export default App;
