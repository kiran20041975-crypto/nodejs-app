const express = require('express');
const promClient = require('prom-client');

const app = express();

// ✅ Collect default metrics (CPU, memory, etc.)
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();

// ✅ Expose /metrics endpoint for Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// Your existing routes below...
app.get('/', (req, res) => {
  res.send('Hello from Node.js!');
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});