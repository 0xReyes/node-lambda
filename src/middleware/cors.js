// CORS middleware: add standard CORS headers to all responses
module.exports = (req, res, next) => {
  // Allow any origin
  res.header('Access-Control-Allow-Origin', '*');
  // Allow common HTTP methods
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  // Allow any headers in requests
  res.header('Access-Control-Allow-Headers', '*');
  // If this is a preflight request, return immediately
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
};
