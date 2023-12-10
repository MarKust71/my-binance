import { Route, Link, Routes } from 'react-router-dom';
import { LiveData } from 'src/routes/trade/LiveData';
import { Futures } from 'src/routes/futures/Futures';

import './App.css';

export const App = () => {
  return (
    <>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/futures">Futures</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<LiveData />} />
        <Route path="/futures" element={<Futures />} />
      </Routes>
    </>
  );
};
