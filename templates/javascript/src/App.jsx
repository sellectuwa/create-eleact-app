import React from 'react';

import reactElectronLogo from '../img/electron-react.svg';

import './App.scss';

const App = () => {
  return (
    <div className="app">
      <img src={reactElectronLogo} alt="React logo" height="150" />
      <h1>This project was bootstrapped using Create Eleact App</h1>
    </div>
  );
};

export default App;
