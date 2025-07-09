const express = require('express');
const ip = require('ip');
const fs = require('fs');
const path = require('path');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
const logRequest = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        method: req.method,
        url: req.url,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        body: req.body
    };
    
    console.log(`[${timestamp}] ${req.method} ${req.url} - IP: ${logEntry.ip}`);
    
    // Write to log file
    const logDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    
    const logFile = path.join(logDir, `${new Date().toISOString().split('T')[0]}.log`);
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
    
    next();
};

app.use(logRequest);

// Health check endpoint
app.get('/health', (req, res) => {
    const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV || 'development'
    };
    
    console.log('Health check requested');
    res.json(healthData);
});

// Ping endpoint
app.get('/ping', (req, res) => {
    const pingData = {
        message: 'pong',
        timestamp: new Date().toISOString(),
        serverIP: ip.address(),
        clientIP: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
    };
    
    console.log('Ping request received');
    res.json(pingData);
});

// Detailed ping with latency measurement
app.get('/ping/detailed', (req, res) => {
    const startTime = Date.now();
    
    const pingData = {
        message: 'pong',
        timestamp: new Date().toISOString(),
        serverIP: ip.address(),
        clientIP: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        latency: Date.now() - startTime,
        headers: req.headers
    };
    
    console.log('Detailed ping request received');
    res.json(pingData);
});

// Root endpoint
app.get('/', (req, res) => {
    const welcomeData = {
        message: 'Welcome to AWS ELB Node.js Application',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            ping: '/ping',
            detailedPing: '/ping/detailed'
        },
        serverInfo: {
            ip: ip.address(),
            port: PORT,
            environment: process.env.NODE_ENV || 'development'
        }
    };
    
    console.log('Root endpoint accessed');
    res.json(welcomeData);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.url}`);
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.url} not found`,
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Server IP: ${ip.address()}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    console.log(`🏓 Ping endpoint: http://localhost:${PORT}/ping`);
    console.log(`📊 Detailed ping: http://localhost:${PORT}/ping/detailed`);
    console.log(`📝 Logs will be saved to: ${path.join(__dirname, 'logs')}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});
