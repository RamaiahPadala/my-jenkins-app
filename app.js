const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Route: Home page
app.get('/', (req, res) => {
    const buildTime = new Date().toISOString();
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Jenkins CI/CD Pipeline</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    max-width: 800px; 
                    margin: 50px auto; 
                    padding: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                .container { 
                    background: rgba(255,255,255,0.1); 
                    padding: 30px; 
                    border-radius: 10px;
                    backdrop-filter: blur(10px);
                }
                h1 { color: #fff; text-align: center; }
                .info { background: rgba(255,255,255,0.2); padding: 15px; border-radius: 5px; margin: 10px 0; }
                .success { color: #4CAF50; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 Hello from Jenkins CI/CD Pipeline!</h1>
                <div class="info">
                    <p><strong>Status:</strong> <span class="success">Deployment Successful!</span></p>
                    <p><strong>Application:</strong> Node.js Express Server</p>
                    <p><strong>Build Time:</strong> ${buildTime}</p>
                    <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
                    <p><strong>Port:</strong> ${PORT}</p>
                </div>
                <div class="info">
                    <h3>🎯 Pipeline Features:</h3>
                    <ul>
                        <li>✅ Automated Code Checkout</li>
                        <li>✅ Docker Image Building</li>
                        <li>✅ Automated Testing</li>
                        <li>✅ Automated Deployment</li>
                        <li>✅ Health Monitoring</li>
                    </ul>
                </div>
                <p style="text-align: center; margin-top: 30px;">
                    <a href="/health" style="color: #fff; text-decoration: none; background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 5px;">Check Health Status</a>
                </p>
            </div>
        </body>
        </html>
    `);
});

// Route: Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: require('./package.json').version
    });
});

// Route: API info
app.get('/api/info', (req, res) => {
    res.json({
        name: 'Jenkins CI/CD Demo App',
        version: '1.0.0',
        description: 'A Node.js application deployed via Jenkins pipeline',
        endpoints: [
            { path: '/', method: 'GET', description: 'Home page' },
            { path: '/health', method: 'GET', description: 'Health check' },
            { path: '/api/info', method: 'GET', description: 'API information' }
        ]
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`ℹ️  API info: http://localhost:${PORT}/api/info`);
});

module.exports = app;