const { createComment } = require('./../../services/Github');
const { fn } = require('./../commentHowItWorks');

jest.mock('./../../services/Github', () => ({
    createComment: jest.fn(),
}));

describe('commentHowItWorks action', () => {
    it('should call the create comment method with the right values', ()  => {
        const req = {};
        fn(req);
        expect(createComment).toHaveBeenCalledWith({
            req,
            body: `This repo has installed the Git2Gus application. If you want to know how it works navigate to https://lwc-gus-bot.herokuapp.com/#how-it-works`,
        });
    });
});
