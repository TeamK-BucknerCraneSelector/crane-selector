const { recommendation } = require('../server');

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
];

describe('Recommendation Algorithm Tests', () => {
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