// src/middleware/rate-limiter.js

const ipMap = {};
const WINDOW_MS = 60_000;
const MAX_REQS = 60;

module.exports = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  if (!ipMap[ip]) ipMap[ip] = { count: 1, start: now };
  else {
    const entry = ipMap[ip];
    if (now - entry.start < WINDOW_MS) {
      entry.count++;
    } else {
      ipMap[ip] = { count: 1, start: now };
    }
  }

  if (ipMap[ip].count > MAX_REQS) {
    return res.status(429).json({ error: 'Too Many Requests' });
  }

  next();
};
