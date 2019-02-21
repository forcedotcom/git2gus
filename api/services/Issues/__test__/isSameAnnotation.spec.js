const isSameAnnotation = require('../isSameAnnotation');

describe('isSameAnnotation issues service', () => {
    it('should return true when is same annotation', () => {
        const descriptions = [
            '@W-12345@',
            'some text @W-12345@',
            'text@W-12345@',
            'some @W-12345@ text',
            'some@W-12345@text',
        ];
        descriptions.forEach((description) => {
            expect(isSameAnnotation(description, '@W-12345@')).toBe(true);
        });
    });
    it('should return false when is not the same annotation', () => {
        const descriptions = [
            '@W-1234@',
            '@W-123456@',
            'W-12345',
            '@12345@',
            '@-12345@',
            '@W12345@',
            'some text W-12345@',
            'text@W-12345',
            '',
            null,
            undefined,
            {},
            [],
            12345,
        ];
        descriptions.forEach((description) => {
            expect(isSameAnnotation(description, '@W-12345@')).toBe(false);
        });
    });
    it('should return false when both descriptions passed are null', () => {
        expect(isSameAnnotation(null, null)).toBe(false);
    });
});
