/**
 * Mock Backend Service for Local Development Testing
 *
 * This is a simple Node.js/Express server that can be used for testing
 * the Shipment Tracking application locally without needing the actual backend.
 *
 * Installation:
 * 1. Install express: npm install express
 * 2. Save this file as: mock-backend.js
 * 3. Run: node mock-backend.js
 * 4. Server will start on http://localhost:8080
 */

const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Sample data
const mockShipments = {
  'SHIP001': [
    { shipmentId: 'SHIP001', origin: 'New York', destination: 'Los Angeles', trackStatus: 'In Transit' },
    { shipmentId: 'SHIP002', origin: 'Chicago', destination: 'Miami', trackStatus: 'Delivered' }
  ],
  'SHIP003': [
    { shipmentId: 'SHIP003', origin: 'Boston', destination: 'Seattle', trackStatus: 'Processing' },
    { shipmentId: 'SHIP004', origin: 'Denver', destination: 'Phoenix', trackStatus: 'Out for Delivery' }
  ],
  'SHIP005': [
    { shipmentId: 'SHIP005', origin: 'San Francisco', destination: 'Portland', trackStatus: 'Pending' }
  ]
};

// POST /api/shipment
app.post('/api/shipment', (req, res) => {
  const { shipmentId, shipmentType, attributes, comments } = req.body;

  // Validate request
  if (!shipmentId || !shipmentType) {
    return res.status(400).json({
      error: 'Missing required fields: shipmentId and shipmentType'
    });
  }

  // Log the request
  console.log('\n📦 Shipment Request Received:');
  console.log('  ID:', shipmentId);
  console.log('  Type:', shipmentType);
  console.log('  Attributes:', attributes || []);
  console.log('  Comments:', comments || 'None');

  // Simulate delay (1-2 seconds)
  const delay = Math.random() * 1000 + 500;

  setTimeout(() => {
    // Return mock data based on shipmentId
    const results = mockShipments[shipmentId] || [
      {
        shipmentId: shipmentId,
        origin: 'Default Origin',
        destination: 'Default Destination',
        trackStatus: shipmentType === 'domestic' ? 'In Transit' : 'International Processing'
      }
    ];

    console.log('📤 Sending Response:', JSON.stringify(results, null, 2));
    res.json(results);
  }, delay);
});

// GET /api/health - Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mock backend is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                  Mock Backend Server                        ║
╚══════════════════════════════════════════════════════════════╝

✅ Server running on http://localhost:${PORT}
✅ CORS enabled for frontend communication
✅ Ready to receive shipment requests

📝 Available Endpoints:
   POST  /api/shipment         - Submit shipment (main endpoint)
   GET   /api/health           - Health check

📦 Test Shipment IDs:
   - SHIP001  → Returns 2 results
   - SHIP003  → Returns 2 results
   - SHIP005  → Returns 1 result
   - Any other ID → Returns 1 default result

💡 To test:
   1. Start this server: node mock-backend.js
   2. Start Angular app: npm start
   3. Fill form and submit
   4. Watch console for request/response logs

Press Ctrl+C to stop the server
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Server shutting down...');
  process.exit(0);
});

