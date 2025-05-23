// Security middleware: validate 'url' query parameter and host
const { validateHost } = require('../config/allowed-hosts');

module.exports = (req, res, next) => {
  const url = new URL(`https://${req.path}`);


  if (!url) {
    return res.status(400).json({ error: 'Missing url query parameter' });
  }
  try {
    // Use validateHost to check against block list
    if (!validateHost(url.hostname)) {
      return res.status(403).json({ error: 'Host is blocked by proxy settings' });
    }
  } catch (err) {
    // URL parsing failed
    return res.status(400).json({ error: err });
  }
  next();
};
