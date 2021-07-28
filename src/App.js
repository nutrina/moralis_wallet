import React from 'react';
import { useMoralis } from "react-moralis";
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import { Wallet } from './features/wallet/Wallet';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';


function App() {
  const { Moralis, isAuthenticated, user, logout, isAuthenticating, isInitialized, authenticate } = useMoralis();



  const handleLoginWithMetamask = () => {
    authenticate();
  }

  if (!isInitialized || isAuthenticating) {
    return <div> Please wait, we are authentication you ... </div>
  }

  let authenticationButton = null;
  let userInfo = null;
  
  if (!isAuthenticated) {
    authenticationButton = <button onClick={handleLoginWithMetamask}>Login with Metamask</button>
  } else {
    userInfo = <div>
      You are logged in as: {user.get('username')}
    </div>
  }

  console.log("User accounts: ", user.get("accounts"))
  return (
    <div className="App">
      <div>Welcome to Moralis</div>
      { authenticationButton }
      { userInfo }
      Here are your balances:
      <Wallet />
    </div>
  );
}

export default App;
