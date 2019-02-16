const update = require('../update');

global.Issues = {
    update: jest.fn(() => ({
        fetch: jest.fn(() => Promise.resolve('updated issue')),
    })),
};
const issue = {
    subject: 'new title',
};

describe('update issues service', () => {
    it('should call Issues.update with the right values', () => {
        update('12345', issue);
        expect(global.Issues.update).toHaveBeenCalledWith({
            id: '12345'
        }, issue);
    });
    it('should return the issue updated', async () => {
        const updatedIssue = await update('12345', issue);
        expect(updatedIssue).toBe('updated issue');
    });
});
