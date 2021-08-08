import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { MoralisProvider } from "react-moralis";
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";

// import { init as initWallet } from './features/provider/wallet';

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  }
})



async function init() {
  // appId={window.MORALIS_APP_ID} serverUrl={window.MORALIS_SERVER_URL}
  let MORALIS_APP_ID = null;
  let MORALIS_SERVER_URL = null;

  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // Load secrets from env variables
    MORALIS_APP_ID = window.MORALIS_APP_ID;
    MORALIS_SERVER_URL = window.MORALIS_SERVER_URL;
  } else {
    // Load secrets dynamically
    try {
      const response = await fetch(window.MORALIS_CONFIG_URL);
      const config_data = await response.json();
      MORALIS_APP_ID = config_data.app_id;
      MORALIS_SERVER_URL = config_data.server_url;
    } catch (error) {
      console.error("Failed to load app config: ", error);
    }
  }

  ReactDOM.render(
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <MoralisProvider appId={MORALIS_APP_ID} serverUrl={MORALIS_SERVER_URL}>
        <React.StrictMode>
          <Provider store={store}>
            <ChakraProvider theme={theme}>
              <App />
            </ChakraProvider>
          </Provider>
        </React.StrictMode>
      </MoralisProvider>
    </>,

    document.getElementById('root')
  );

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();

}

init();
