const mock_cranes = require('../__mocks__/cranes.json');

jest.mock('./cranes.json', () => mock_cranes);

const request = require("supertest");

const { recommendation, app } = require('./server');

describe('/api/cranes endpoint', () => {
    test('returns all cranes', async () => {
        const res = await request(app).get("/api/cranes");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mock_cranes)
    });
});

describe('/api/recommendation endpoint', () => {
    test('handles bad inputs by setting to 0', async () => {
        const res = await request(app).get("/api/recommendation?weight=strings&height=are&radius=bad");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(recommendation(mock_cranes, 0, 0, 0));
    });
});