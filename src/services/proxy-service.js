
module.exports.proxyRequest = async (req, res, next) => {
  try {
    const url = new URL(`https://${req.path}`)
    for (const [key, value] of Object.entries(req.query)) {
      if (key !== 'url') {
        url.searchParams.append(key, value);
      }
    }

    // Copy incoming request headers, then remove or override restrictive ones
    const headers = { ...req.headers };
    delete headers['host'];
    delete headers['origin'];
    delete headers['referer'];
    delete headers['cookie'];

    // Prepare options for fetch
    const options = {
      method: req.method,
      headers: headers
    };

    // Forward JSON body if present
    if (req.body && Object.keys(req.body).length > 0) {
      options.body = JSON.stringify(req.body);
      if (!options.headers['content-type']) {
        options.headers['content-type'] = 'application/json';
      }
    }

    // Perform the upstream request using built-in fetch
    const upstreamResponse = await fetch(url.toString(), options);

    // Set the HTTP status code from upstream
    res.status(upstreamResponse.status);

    // Forward all headers except hop-by-hop and CORS headers
    upstreamResponse.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      // HTTP/1.1 hop-by-hop headers (must not be forwarded):contentReference[oaicite:6]{index=6}
      const hopByHop = [
        'connection',
        'keep-alive',
        'proxy-authenticate',
        'proxy-authorization',
        'te',
        'trailer',
        'transfer-encoding',
        'upgrade'
      ];
      if (hopByHop.includes(lower)) return;
      // Skip any CORS response headers from upstream (we set our own)
      if (lower.startsWith('access-control-')) return;
      // Otherwise, set the header on our response
      res.setHeader(key, value);
    });

    // Stream the response body
    const buffer = await upstreamResponse.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error('Error in proxyRequest:', 'err');
    // Pass any error to the global error handler
    next(err);
  }
};
