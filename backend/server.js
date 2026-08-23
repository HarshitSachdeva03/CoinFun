// backend/server.js
const express = require('express');
const http = require('http');
const { Server } = require('ws');
const cors = require('cors');

const app = express();

// Enable CORS so our React frontend (running on port 5173/3000) can talk to Express[cite: 1, 2]
app.use(cors());
app.use(express.json());

// Mock DB in-memory log
const orders = [];

// REST Endpoint: Submit an Order
app.post('/api/orders', (req, res) => {
  const { symbol, type, amount, price } = req.body;
  if (!symbol || !amount || !price) {
    return res.status(400).json({ error: 'Invalid order payload' });
  }

  const newOrder = {
    id: Date.now(),
    symbol,
    type,
    amount: parseFloat(amount),
    price: parseFloat(price),
    status: 'FILLED',
  };

  orders.push(newOrder);
  console.log('Order created on backend:', newOrder);

  return res.status(201).json({ success: true, order: newOrder });
});

// Create HTTP server and attach WebSocket Server
const server = http.createServer(app);
const wss = new Server({ server });

// WebSocket Stream for Live Ticker Prices
wss.on('connection', (ws) => {
  console.log('Frontend client connected to WS ticker stream');

  const interval = setInterval(() => {
    const mockTicker = {
      symbol: 'BTCUSDT',
      price: (60000 + (Math.random() * 200 - 100)).toFixed(2),
      timestamp: Date.now(),
    };
    ws.send(JSON.stringify(mockTicker));
  }, 2000);

  ws.on('close', () => {
    console.log('Frontend client disconnected');
    clearInterval(interval);
  });
});

server.listen(5000, () => console.log('Backend server running on http://localhost:5000'));