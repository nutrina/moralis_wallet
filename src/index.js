import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { MoralisProvider } from "react-moralis";
import { appId, serverUrl } from './config';

import { init as initWallet } from './features/provider/wallet';


async function init() {
  try {
    await initWallet();
  } catch (error) {
    console.error("Failed to initialize App: ", error);
  }
  
  ReactDOM.render(
  <MoralisProvider appId={appId} serverUrl={serverUrl}>
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  </MoralisProvider>,

    document.getElementById('root')
    );

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.unregister();

}

init();
