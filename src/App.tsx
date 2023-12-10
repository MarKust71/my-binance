import { Route, Link, Routes } from 'react-router-dom';
import { LiveData } from 'src/routes/trade/LiveData';
import { Futures } from 'src/routes/futures/Futures';

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
              <Link to="/contact">Kontakt</Link>
            </li>
          </ul>
        </nav>

        <hr />
      </div>

      <Routes>
        <Route path="/" element={<LiveData />} />
        <Route path="/futures" element={<Futures />} />
      </Routes>
    </>
  );
};
