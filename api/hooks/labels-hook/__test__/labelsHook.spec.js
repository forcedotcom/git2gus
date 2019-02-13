const labelsHook = require('../index');
const asyncQueue = require('async/queue');

jest.mock('async/queue', () => jest.fn());

describe('labelsHook', () => {
    it('should call asyncQueue with the right values', () => {
        labelsHook();
        expect(asyncQueue).toHaveBeenCalledWith(expect.any(Function), 1);
    });
    it('should return the queue', () => {
        asyncQueue.mockReset();
        asyncQueue.mockReturnValue({
            push: () => {},
        });
        expect(labelsHook()).toEqual({
            queue: {
                push: expect.any(Function),
            },
        });
    });
    describe('labelHook worker', () => {
        it('should call task.execute and done functions passed to the worker', async () => {
            asyncQueue.mockReset();
            labelsHook();
            const task = {
                execute: jest.fn(),
            };
            const done = jest.fn();
            const worker = asyncQueue.mock.calls[0][0];
            await worker(task, done);
            expect(task.execute).toHaveBeenCalledTimes(1);
            expect(done).toHaveBeenCalledTimes(1);
        });
    });
});
