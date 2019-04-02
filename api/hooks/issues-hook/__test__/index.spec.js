const { queue } = require('./../index')();

jest.mock('../create-or-update-gus-item', () => {
    return async () => {
        return Promise.resolve({ id: 12345 });
    };
});

describe('issues-hook queue', () => {
    describe('consumer', () => {
        it('should call the done function with the value returned from the handler func', doneTest => {
            expect.assertions(1);
            const done = (error, item) => {
                expect(item).toEqual({ id: 12345 });
                doneTest();
            };
            queue.push(
                {
                    name: 'CREATE_GUS_ITEM'
                },
                done
            );
        });
    });
});
