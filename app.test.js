const request = require('supertest');
const app = require('./app');

describe('Node.js App Tests', () => {
    test('GET / should return home page', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Hello from Jenkins CI/CD Pipeline');
    });

    test('GET /health should return health status', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('healthy');
        expect(response.body).toHaveProperty('timestamp');
    });

    test('GET /api/info should return API information', async () => {
        const response = await request(app).get('/api/info');
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Jenkins CI/CD Demo App');
        expect(response.body).toHaveProperty('endpoints');
    });

    test('Health endpoint should have correct structure', async () => {
        const response = await request(app).get('/health');
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('uptime');
        expect(response.body).toHaveProperty('version');
    });
});