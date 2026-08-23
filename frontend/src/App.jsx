// frontend/src/App.jsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { TradingDashboard } from './components/tradingDashboard';

export default function App() {
  return (
    <Provider store={store}>
      <TradingDashboard />
    </Provider>
  );
}