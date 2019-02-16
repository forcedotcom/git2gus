const getBuildByName = require('../getBuildByName');

global.Builds = {
    findOne: jest.fn(),
};

describe('getBuildByName builds service', () => {
    it('should call findOne with the right value', () => {
        getBuildByName('build-35');
        expect(Builds.findOne).toHaveBeenCalledWith({
            name: 'build-35',
        });
    });
});
