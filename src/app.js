// Express app setup with middleware and proxy route
const express = require('express');
const { log } = require('./utils/logger');
const cors = require('./middleware/cors');
const rateLimiter = require('./middleware/rate-limiter');
const security = require('./middleware/security');
const { proxyRequest } = require('./services/proxy-service');
const errorHandler = require('./middleware/error-handler');

const app = express();
app.use(rateLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// app.use((req, res, next) => {
//   log(`Incoming request: ${req.method} ${req.url}`);
//   next();
// });

// Apply CORS headers, rate limiting, and security checks
app.use(cors);
app.use(rateLimiter);
app.use(security);

// Main proxy route: catch all paths
app.all(/^\/([^\/]+)\/(.+)/, proxyRequest);

// Global error handler
// app.use(errorHandler);

module.exports = app;