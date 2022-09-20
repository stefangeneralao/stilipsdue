import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';

import { TodosProvider } from '~/context/todos';

import App from './components/App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Auth0Provider
      domain="stefangeneralao.eu.auth0.com"
      clientId="iY4ozQWd4RMbje0JO7JnEvd9SyE9f5P2"
      redirectUri={`${window.location.origin}`}
      audience="https://api.test"
    >
      <TodosProvider>
        <App />
      </TodosProvider>
    </Auth0Provider>
  </React.StrictMode>
);
