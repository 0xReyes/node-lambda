```
# Lambda CORS Proxy

A lightweight, CORS Anywhere–style proxy deployed to AWS Lambda via CloudFormation. It forwards HTTP requests to a target URL, adds permissive CORS headers, and supports GET/POST/PUT/DELETE/etc.

---

## Features

- Proxy any external API with full query and header support  
- Adds permissive CORS headers (`Access-Control-Allow-Origin: *`)  
- Blocks unwanted hosts via environment-configurable denylist  
- Deployable via `make` and `template.yaml`  
- Runs locally (`node src/handler.js`) or in AWS Lambda via API Gateway

---

## Project Structure

src/  
├── app.js                  # Express app setup  
├── handler.js              # Lambda + local entry point  
├── config/  
│   └── allowed-hosts.js    # Host validation logic  
├── middleware/             # CORS, security, rate-limiter  
├── services/  
│   └── proxy-service.js    # Core proxy logic  
└── utils/  
    └── error-handler.js    # Shared error response formatter

---

## Usage

### Proxy Format

Send requests in this format:  
GET /<target-host>/<path>?<query>

Example:  
curl "https://your-api-id.execute-api.us-east-1.amazonaws.com/api.mexc.com/api/v3/depth?symbol=BTCUSDT"

This will proxy to:  
https://api.mexc.com/api/v3/depth?symbol=BTCUSDT

---

## Run Locally

npm install  
node src/handler.js

Then:  
curl "http://localhost:3000/api.mexc.com/api/v3/depth?symbol=BTCUSDT"

---

## Deployment

### Build and Deploy Code

make package     # Install and zip Lambda function  
make deploy      # Upload function code to AWS Lambda

### First-Time CloudFormation Deployment

aws cloudformation deploy \  
  --template-file template.yaml \  
  --stack-name cors-proxy \  
  --capabilities CAPABILITY_IAM

---

## Environment Configuration

Block specific domains using the `BLOCKED_HOSTS` environment variable:  
BLOCKED_HOSTS=localhost,127.0.0.1

---

## License

MIT
```
