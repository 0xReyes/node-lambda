// Proxy service: forward the incoming request to the target URL and return the upstream response
module.exports.proxyRequest = async (req, res, next) => {
  try {
    // Extract proxy path from route (e.g., api.mexc.com/api/v3/depth)
    const rawTarget = `https://${req.params.proxy}`;
    const url = new URL(rawTarget);

    // Append query parameters to the target URL
    for (const [key, value] of Object.entries(req.query)) {
      url.searchParams.append(key, value);
    }

    // Clone and clean incoming headers
    const headers = { ...req.headers };
    delete headers['host'];
    delete headers['origin'];
    delete headers['referer'];
    delete headers['cookie'];

    // Prepare request options
    const options = {
      method: req.method,
      headers: headers,
    };

    // Forward request body if present
    if (req.body && Object.keys(req.body).length > 0) {
      options.body = JSON.stringify(req.body);
      if (!options.headers['content-type']) {
        options.headers['content-type'] = 'application/json';
      }
    }

    // Perform upstream request
    const upstreamResponse = await fetch(url.toString(), options);

    // Forward status code
    res.status(upstreamResponse.status);

    // Forward headers (excluding hop-by-hop and CORS)
    upstreamResponse.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      const hopByHop = [
        'connection',
        'keep-alive',
        'proxy-authenticate',
        'proxy-authorization',
        'te',
        'trailer',
        'transfer-encoding',
        'upgrade',
      ];
      if (hopByHop.includes(lower)) return;
      if (lower.startsWith('access-control-')) return;
      res.setHeader(key, value);
    });

    // Stream response body
    const buffer = await upstreamResponse.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error('Error in proxyRequest:', err);
    next(err);
  }
};
