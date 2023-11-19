import React from 'react';
import ReactDOM from 'react-dom/client';
import { IntlProvider } from 'react-intl';

import App from './App';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <IntlProvider locale="pl" defaultLocale="pl" messages={{}}>
      <App />
    </IntlProvider>
  </React.StrictMode>,
);
