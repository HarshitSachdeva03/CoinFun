// frontend/src/components/TradingDashboard.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { executeTrade } from '../store/portfolioSlice';
import { usePriceWebSocket } from '../hooks/usePriceWebSocket';

export const TradingDashboard = () => {
  const dispatch = useDispatch();
  
  // 1. Read Global State from Redux Store
  const { cashBalance, holdings } = useSelector((state) => state.portfolio);

  // 2. Stream Live Ticker via Custom WebSocket Hook
  const liveTicker = usePriceWebSocket('ws://localhost:5000');

  // 3. Form Input Local State
  const [amount, setAmount] = useState('0.1');

  const handleOrder = async (orderType) => {
    if (!liveTicker) return;

    const currentPrice = parseFloat(liveTicker.price);
    const orderAmount = parseFloat(amount);

    // Step A: Optimistic Global State Update in Redux
    dispatch(executeTrade({
      type: orderType,
      symbol: 'BTC',
      amount: orderAmount,
      price: currentPrice,
    }));

    // Step B: Direct API Integration with Express Backend[cite: 1, 2, 5]
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: 'BTC',
          type: orderType,
          amount: orderAmount,
          price: currentPrice,
        }),
      });

      const data = await response.json();
      console.log('Order successfully synced with backend:', data);
    } catch (err) {
      console.error('Failed to post order to server:', err);
    }
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '500px' }}>
      <h2>CoinFun Paper Trading</h2>

      <div style={{ background: '#f4f4f4', padding: '12px', borderRadius: '8px' }}>
        <h3>Portfolio Summary</h3>
        <p>Cash Available: <strong>${cashBalance.toFixed(2)}</strong></p>
        <p>BTC Balance: <strong>{holdings.BTC ? holdings.BTC.toFixed(4) : 0} BTC</strong></p>
      </div>

      <div style={{ margin: '20px 0', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Live Market Stream</h3>
        {liveTicker ? (
          <p>{liveTicker.symbol}: <strong>${liveTicker.price}</strong></p>
        ) : (
          <p>Connecting to price stream...</p>
        )}
      </div>

      <div>
        <h3>Place Order</h3>
        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          step="0.01" 
          style={{ padding: '8px', marginRight: '8px' }}
        />
        <button onClick={() => handleOrder('BUY')} style={{ padding: '8px 16px', marginRight: '8px' }}>
          Buy BTC
        </button>
        <button onClick={() => handleOrder('SELL')} style={{ padding: '8px 16px' }}>
          Sell BTC
        </button>
      </div>
    </div>
  );
};