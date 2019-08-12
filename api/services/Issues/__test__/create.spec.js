const pick = require('lodash/pick');
const create = require('../create');

jest.mock('lodash/pick', () =>
    jest.fn(() => ({
        subject: 'issue title',
        description: 'issue description',
        productTag: 'abcd1234',
        status: 'NEW',
        foundInBuild: '218',
        priority: 'P1',
        relatedUrl: 'github/pepe/repo'
    }))
);
global.Issues = {
    create: jest.fn(() => ({
        fetch: jest.fn(() => Promise.resolve('created issue'))
    }))
};

const data = {
    subject: 'issue title',
    description: 'issue description',
    status: 'NEW'
};

describe('create issues service', () => {
    it('should call pick with the right values', () => {
        create(data);
        expect(pick).toHaveBeenCalledWith(data, [
            'subject',
            'description',
            'storyDetails',
            'productTag',
            'status',
            'foundInBuild',
            'priority',
            'relatedUrl'
        ]);
    });
    it('should call Issues.create with the right values', () => {
        global.Issues.create.mockReset();
        create(data);
        expect(global.Issues.create).toHaveBeenCalledWith({
            subject: 'issue title',
            description: 'issue description',
            productTag: 'abcd1234',
            status: 'NEW',
            foundInBuild: '218',
            priority: 'P1',
            relatedUrl: 'github/pepe/repo'
        });
    });
    it('should return the issue create', async () => {
        global.Issues.create.mockReset();
        global.Issues.create.mockReturnValue({
            fetch: () => Promise.resolve('created issue')
        });
        const issue = await create(data);
        expect(issue).toBe('created issue');
    });
});
