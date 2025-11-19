const mock_cranes = require('../../mocks/cranes.json');

jest.mock('../../cranes.json', () => mock_cranes);
jest.mock('jsforce');

const jsforce = require('jsforce');
const request = require("supertest");

const { recommendation, app, __setConnection } = require('../../server');

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

describe('/api/submit-quote endpoint', () => {
    let mockConn;

    beforeEach(() => {
        jest.clearAllMocks();
        mockConn = new jsforce.Connection({ loginUrl: "test-url"});
        mockConn.accessToken = "fake-token";
        __setConnection(mockConn);
    });

    test('validates inputs', async () => {
        let res = await request(app)
            .post('/api/submit-quote')
            .send({ name: "John" });
        expect(res.statusCode).toBe(400);

        res = await request(app)
            .post('/api/submit-quote')
            .send({ email: "john@doe.com" });
        expect(res.statusCode).toBe(400);

        res = await request(app)
            .post('/api/submit-quote')
            .send({ crane: "test crane" });
        expect(res.statusCode).toBe(400);

        res = await request(app)
            .post('/api/submit-quote')
            .send({ phone: "XXX-XXX-XXXX" });
        expect(res.statusCode).toBe(400);

        res = await request(app)
            .post('/api/submit-quote')
            .send({ projectDetails: "blah blah" });
        expect(res.statusCode).toBe(400);
    });

    test('submits quote and handles success', async () => {
        mockConn._sobjectCreateMock = jest.fn().mockResolvedValue({
            success: true,
            id: 'mock-id-123'
        });
        mockConn.sobject = jest.fn().mockReturnValue({
            create: mockConn._sobjectCreateMock
        });

        const payload = {
            crane: "CR-1000",
            name: "John Doe",
            email: "john@example.com",
            phone: "123-456-7890",
            projectDetails: "Need a crane for a project.",
        };

        const res = await request(app)
            .post("/api/submit-quote")
            .send(payload);

        expect(mockConn._sobjectCreateMock).toHaveBeenCalledWith({
            Name: `Quote - ${payload.name} - ${payload.crane}`,
            Crane_Model__c: payload.crane,
            Customer_Name__c: payload.name,
            Email__c: payload.email,
            Phone__c: payload.phone,
            Company__c: '',
            Project_Details__c: payload.projectDetails,
            Quote_Status__c: 'New',
            Source_Flow__c: ''
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.id).toBe("mock-id-123");
    });

    test('submits quote and handles failure', async () => {
        mockConn._sobjectCreateMock = jest.fn().mockResolvedValue({
            success: false,
            errors: 'mock errors'
        });
        mockConn.sobject = jest.fn().mockReturnValue({
            create: mockConn._sobjectCreateMock
        });

        const payload = {
            crane: "CR-1000",
            name: "John Doe",
            email: "john@example.com",
            phone: "123-456-7890",
            projectDetails: "Need a crane for a project.",
        };

        const res = await request(app)
            .post("/api/submit-quote")
            .send(payload);

        expect(mockConn._sobjectCreateMock).toHaveBeenCalledWith({
            Name: `Quote - ${payload.name} - ${payload.crane}`,
            Crane_Model__c: payload.crane,
            Customer_Name__c: payload.name,
            Email__c: payload.email,
            Phone__c: payload.phone,
            Company__c: '',
            Project_Details__c: payload.projectDetails,
            Quote_Status__c: 'New',
            Source_Flow__c: ''
        });

        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.details).toBe("mock errors");
    });

    test('submits quote and handles errors', async () => {
        // omit the definitions for the sobject and create functions

        const payload = {
            crane: "CR-1000",
            name: "John Doe",
            email: "john@example.com",
            phone: "123-456-7890",
            projectDetails: "Need a crane for a project.",
        };

        let res = await request(app)
            .post("/api/submit-quote")
            .send(payload);

        expect(res.statusCode).toBe(500);
    });
})