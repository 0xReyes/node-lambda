const awsServerlessExpress = require('aws-serverless-express');
const fs = require('fs');
const http = require('http');
const https = require('https');
const app = require('./app');

const server = awsServerlessExpress.createServer(app);

// Lambda handler
exports.handler = async (event, context) => {
  return awsServerlessExpress.proxy(server, event, context);
};

// Local-only: HTTPS with fallback to HTTP
if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  const port = process.env.PORT || 3000;

  const certPath = './cert/cert.pem';
  const keyPath = './cert/key.pem';

  if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
    const options = {
      cert: fs.readFileSync(certPath),
      key: fs.readFileSync(keyPath),
    };
    https.createServer(options, app).listen(port, () => {
      console.log(`Local HTTPS server running at https://localhost:${port}`);
    });
  } else {
    http.createServer(app).listen(port, () => {
      console.log(`Local HTTP server running at http://localhost:${port}`);
    });
  }
}
