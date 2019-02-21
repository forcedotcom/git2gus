const update = require('../update');

global.Issues = {
    updateOne: jest.fn(() => Promise.resolve('updated issue')),
};
const issue = {
    subject: 'new title',
};

describe('update issues service', () => {
    it('should call Issues.updateOne with the right values', () => {
        update('12345', issue);
        expect(global.Issues.updateOne).toHaveBeenCalledWith({
            id: '12345'
        }, issue);
    });
    it('should return the issue updated', async () => {
        const updatedIssue = await update('12345', issue);
        expect(updatedIssue).toBe('updated issue');
    });
});
