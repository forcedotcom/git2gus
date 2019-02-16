const waitUntilSynced = require('../waitUntilSynced');

global.Issues = { findOne: jest.fn() };

describe('waitUntilSynced issues service', () => {
    it('should return the synced issue when the issue gets synced',  async () => {
        Issues.findOne
                .mockReturnValueOnce(Promise.resolve({ syncState: 'PENDING' }))
                .mockReturnValueOnce(Promise.resolve({ syncState: 'PENDING' }))
                .mockReturnValue(Promise.resolve({
                    id: 12345,
                    sfid: 67890,
                    syncState: 'SYNCED',
                }));
        const issue = {
            id: 12345,
        };
        const syncedIssue = await waitUntilSynced(issue, { interval: 10 });
        expect(syncedIssue).toEqual({
            id: 12345,
            sfid: 67890,
            syncState: 'SYNCED',
        });
    });
    it('should resolve undefined when the Issue was not synced', async () => {
        Issues.findOne.mockReturnValue(Promise.resolve({
            id: 12345,
            syncState: 'PENDING',
        }));
        const issue = {
            id: 12345,
        };
        const syncedIssue = await waitUntilSynced(issue, { interval: 10 });
        expect(syncedIssue).toBeUndefined();
    });
});
