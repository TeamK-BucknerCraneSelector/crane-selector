jest.mock('jsforce');
const jsforce = require('jsforce');

const { getSalesforceConnection, __setConnection } = require('../../server');

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
