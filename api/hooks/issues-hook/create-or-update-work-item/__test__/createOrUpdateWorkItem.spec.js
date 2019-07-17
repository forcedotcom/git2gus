const createOrUpdateWorkItem = require('..');
const Issues = require('../../../../services/Issues');

jest.mock('../../../../services/Issues', () => ({
    getByRelatedUrl: jest.fn(),
    update: jest.fn(),
    create: jest.fn()
}));
const task = {
    subject: 'issue 35',
    description: 'fix bugs',
    storyDetails: 'fix bugs',
    productTag: 'abcd1234',
    status: 'NEW',
    foundInBuild: 'qwerty1234',
    priority: 'P1',
    relatedUrl: 'github/test-app/#15'
};

describe('createOrUpdateWorkItem issues hook', () => {
    it('should call Issues.getByRelatedUrl with the right value', () => {
        createOrUpdateWorkItem(task);
        expect(Issues.getByRelatedUrl).toHaveBeenCalledWith(
            'github/test-app/#15'
        );
    });
    it('should call Issues.update with the right values when the issue exists and have a great priority', async () => {
        expect.assertions(1);
        Issues.getByRelatedUrl.mockReset();
        Issues.update.mockReset();
        Issues.getByRelatedUrl.mockReturnValue({
            id: '12345',
            priority: 'P2'
        });
        await createOrUpdateWorkItem(task);
        expect(Issues.update).toHaveBeenCalledWith('12345', {
            priority: 'P1'
        });
    });
    it('should call Issues.create with the right values when the issue does not exists', async () => {
        expect.assertions(1);
        Issues.getByRelatedUrl.mockReset();
        Issues.create.mockReset();
        Issues.getByRelatedUrl.mockReturnValue(null);
        await createOrUpdateWorkItem(task);
        expect(Issues.create).toHaveBeenCalledWith({
            subject: 'issue 35',
            description: 'fix bugs',
            storyDetails: 'fix bugs',
            productTag: 'abcd1234',
            status: 'NEW',
            foundInBuild: 'qwerty1234',
            priority: 'P1',
            relatedUrl: 'github/test-app/#15'
        });
    });
    it('should not call anything when the issue exists and have the same priority', async () => {
        expect.assertions(2);
        Issues.getByRelatedUrl.mockReset();
        Issues.update.mockReset();
        Issues.create.mockReset();
        Issues.getByRelatedUrl.mockReturnValue({
            id: '12345',
            priority: 'P1'
        });
        await createOrUpdateWorkItem(task);
        expect(Issues.update).not.toHaveBeenCalled();
        expect(Issues.create).not.toHaveBeenCalled();
    });
    it('should not call anything when the issue exists and have a lower priority', async () => {
        expect.assertions(2);
        Issues.getByRelatedUrl.mockReset();
        Issues.update.mockReset();
        Issues.create.mockReset();
        Issues.getByRelatedUrl.mockReturnValue({
            id: '12345',
            priority: 'P0'
        });
        await createOrUpdateWorkItem(task);
        expect(Issues.update).not.toHaveBeenCalled();
        expect(Issues.create).not.toHaveBeenCalled();
    });
    it('should return the work item created', async () => {
        expect.assertions(1);
        const workItem = { id: '12345' };
        Issues.getByRelatedUrl.mockReturnValue(null);
        Issues.create.mockReturnValue(Promise.resolve(workItem));
        const issue = await createOrUpdateWorkItem(task);
        expect(issue).toBe(workItem);
    });
    it('should return the work item updated', async () => {
        expect.assertions(1);
        const workItem = { id: '12345' };
        Issues.getByRelatedUrl.mockReturnValue(workItem);
        Issues.update.mockReturnValue(Promise.resolve(workItem));
        const issue = await createOrUpdateWorkItem(task);
        expect(issue).toBe(workItem);
    });
});
