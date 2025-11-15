jest.mock('jsforce');
jest.mock('./cranes.json', () => mock_cranes);

const jsforce = require('jsforce');
const request = require("supertest");

const mock_cranes = [
    {
        "model": "TEST CRANE 1",
        "max_load": 100,
        "max_height": 100,
        "max_radius": 100,
        "image_path": "test.jpg"
    },
    {
        "model": "TEST CRANE 2",
        "max_load": 200,
        "max_height": 200,
        "max_radius": 200,
        "image_path": "test.jpg"
    },
    {
        "model": "TEST CRANE 3",
        "max_load": 300,
        "max_height": 300,
        "max_radius": 300,
        "image_path": "test.jpg"
    },
    {
        "model": "TEST CRANE 4",
        "max_load": 400,
        "max_height": 400,
        "max_radius": 400,
        "image_path": "test.jpg"
    }
]

const { recommendation, getSalesforceConnection, __setConnection, app } = require('./server');


describe('Crane Recommendation Algorithm', () => {
    test('should return at most 3 cranes', () => {
        const result = recommendation(mock_cranes, 100, 100, 100);
        expect(result.length).toBe(3);
    });

    test('should return the correct cranes and fields', () => {
        // all cranes match but only the first 3 should be returned
        let result = recommendation(mock_cranes, 100, 100, 100);
        expect(result).toEqual(mock_cranes.slice(0,3));

        // all cranes match except first one
        result = recommendation(mock_cranes, 200, 200, 200);
        expect(result).toEqual(mock_cranes.slice(1,4));

        // last two cranes match
        result = recommendation(mock_cranes, 300, 300, 300);
        expect(result).toEqual(mock_cranes.slice(2,4));

        // last crane matches
        result = recommendation(mock_cranes, 400, 400, 400);
        expect(result).toEqual(mock_cranes.slice(3,4));

        // no cranes match
        result = recommendation(mock_cranes, 500, 500, 500);
        expect(result).toEqual([]);
    });

    test('should not modify input cranes' ,() => {
        const copy = [...mock_cranes];
        recommendation(mock_cranes, 100, 100, 100);
        expect(mock_cranes).toEqual(copy);
    });
});

describe('Salesforce Connection', () => {
    beforeEach(() => {
        __setConnection(null); // clear cached connection
        jest.clearAllMocks();
    });

    test('logs in and returns connection when none is cached', async () => {
        const mockConn = new jsforce.Connection({ loginUrl: 'test-url' });
        mockConn.login.mockResolvedValueOnce();
        mockConn.accessToken = 'fake-token';

        jsforce.Connection.mockImplementation(() => mockConn);

        const conn = await getSalesforceConnection();

        expect(jsforce.Connection).toHaveBeenCalledWith({ loginUrl: undefined });
        expect(mockConn.login).toHaveBeenCalled();
        expect(conn).toEqual(mockConn);
    });

    test('returns connection if it is cached', async () => {
        const cachedConn = { accessToken: 'abc123' };

        __setConnection(cachedConn);

        const conn = await getSalesforceConnection();

        expect(conn).toBe(cachedConn);
        expect(jsforce.Connection).not.toHaveBeenCalled();
    });

    test('throws error if login fails', async () => {
        const mockConn = new jsforce.Connection({ loginUrl: 'test-url' });
        mockConn.login.mockRejectedValueOnce(new Error('Login failed'));

        jsforce.Connection.mockImplementation(() => mockConn);

        await expect(getSalesforceConnection()).rejects.toThrow('Login failed');
    })
});

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
        expect(res.body).toEqual(mock_cranes.slice(0,3));
    });
});