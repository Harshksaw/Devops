# AWS ELB Node.js Application

A basic Node.js application with ping functionality and comprehensive logging, designed for AWS Elastic Load Balancer health checks.

## Features

- **Health Check Endpoint**: `/health` - Returns server health status
- **Ping Endpoint**: `/ping` - Simple ping/pong response
- **Detailed Ping**: `/ping/detailed` - Ping with latency and detailed information
- **Comprehensive Logging**: All requests are logged to console and daily log files
- **Error Handling**: Proper error handling and 404 responses
- **Graceful Shutdown**: Handles SIGTERM and SIGINT signals

## Endpoints

### Health Check
```
GET /health
```
Returns server health information including uptime, memory usage, and environment.

### Ping
```
GET /ping
```
Simple ping response with server and client IP information.

### Detailed Ping
```
GET /ping/detailed
```
Ping response with latency measurement and request headers.

### Root
```
GET /
```
Welcome page with available endpoints and server information.

## Installation

```bash
npm install
```

## Running the Application

### Production
```bash
npm start
```

### Development (with nodemon)
```bash
npm run dev
```

## Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (default: development)

## Logging

The application logs all requests to:
- **Console**: Real-time request logging
- **Files**: Daily log files in `logs/` directory

Log entries include:
- Timestamp
- HTTP method and URL
- Client IP address
- User agent
- Request body (for POST/PUT requests)

## Example Usage

```bash
# Start the server
npm start

# Test health check
curl http://localhost:3000/health

# Test ping
curl http://localhost:3000/ping

# Test detailed ping
curl http://localhost:3000/ping/detailed
```

## AWS ELB Integration

This application is designed to work with AWS Elastic Load Balancer:

1. **Health Check Path**: `/health`
2. **Health Check Port**: 3000 (or set via PORT environment variable)
3. **Expected Response**: JSON with `status: "healthy"`

## Dependencies

- `express`: Web framework
- `ip`: IP address utilities

## License

ISC 