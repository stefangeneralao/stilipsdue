import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Auth0Provider } from '@auth0/auth0-react';
import { store } from '~/store';
import App from './components/App';
import './index.css';

(async () => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <Provider store={store}>
        <Auth0Provider
          domain={import.meta.env.VITE_AUTH0_DOMAIN}
          clientId={import.meta.env.VITE_AUTH0_CLIENTID}
          redirectUri={`${window.location.origin}${import.meta.env.BASE_URL}`}
          audience={import.meta.env.VITE_AUTH0_AUDIENCE}
          scope={import.meta.env.VITE_AUTH0_SCOPE}
        >
          <App />
        </Auth0Provider>
      </Provider>
    </React.StrictMode>
  );
})();
