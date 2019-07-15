const hasConfig = require('../policies/hasConfig');
const { getConfig, createComment } = require('../services/Github');

jest.mock('../services/Github', () => ({
    getConfig: jest.fn(),
    createComment: jest.fn()
}));

const request = {
    body: {
        repository: {
            name: 'github/pepe/test-github-app',
            owner: {
                login: 'pepe'
            }
        }
    },
    octokitClient: {
        issues: {
            createComment: 'createComment method'
        }
    }
};
const res = {
    notFound: jest.fn(),
    status: jest.fn(() => ({
        send: jest.fn()
    }))
};
const next = jest.fn();

describe('hasConfig policy', () => {
    it('should skip getConfig when event is one of installations', () => {
        const installationEvents = [
            'installation',
            'integration_installation',
            'integration_installation_repositories',
            'installation_repositories'
        ];
        installationEvents.forEach(event => {
            next.mockReset();
            const req = {
                ...request,
                headers: {
                    'x-github-event': event
                },
                body: {
                    action: 'created'
                }
            };
            hasConfig(req, res, next);
            expect(next).toHaveBeenCalledTimes(1);
            expect(getConfig).not.toHaveBeenCalled();
        });
    });
    it('should call getConfig with the right values when event is other than the installations', () => {
        next.mockReset();
        getConfig.mockReset();
        const req = {
            ...request,
            headers: {
                'x-github-event': 'label'
            }
        };
        hasConfig(req, res, next);
        expect(getConfig).toHaveBeenCalledWith({
            owner: 'pepe',
            repo: 'github/pepe/test-github-app',
            octokitClient: {
                issues: {
                    createComment: 'createComment method'
                }
            }
        });
    });
    it('should attach config to req.git2gus', async () => {
        expect.assertions(1);
        getConfig.mockReset();
        getConfig.mockReturnValue(
            Promise.resolve({
                productTag: 'abcd1234',
                defaultBuild: 218
            })
        );
        const req = {
            ...request,
            headers: {
                'x-github-event': 'label'
            }
        };
        await hasConfig(req, res, next);
        expect(req.git2gus).toEqual({
            config: {
                productTag: 'abcd1234',
                defaultBuild: 218
            }
        });
    });
    it('should call next after call getConfig', async () => {
        expect.assertions(2);
        next.mockReset();
        getConfig.mockReset();
        getConfig.mockReturnValue(Promise.resolve({}));
        const req = {
            ...request,
            headers: {
                'x-github-event': 'label'
            }
        };
        await hasConfig(req, res, next);
        expect(getConfig).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledTimes(1);
    });
    it('should respond with not found error when error status is 404', async () => {
        expect.assertions(3);
        next.mockReset();
        createComment.mockReset();
        res.notFound.mockReset();
        getConfig.mockReset();
        getConfig.mockReturnValue(
            Promise.reject({
                status: 404,
                message: 'get config error'
            })
        );
        const req = {
            ...request,
            headers: {
                'x-github-event': 'label'
            }
        };
        await hasConfig(req, res, next);
        expect(res.notFound).toHaveBeenCalledWith({
            status: 'CONFIG_NOT_FOUND',
            message: 'The .git2gus/config.json was not found.'
        });
        expect(next).not.toHaveBeenCalled();
        expect(createComment).not.toHaveBeenCalled();
    });
    it('should call createComment with the right values when error status is other than 404 and an issue is opened', async () => {
        expect.assertions(4);
        getConfig.mockReset();
        getConfig.mockReturnValue(
            Promise.reject({
                status: 403,
                message: 'get config error'
            })
        );
        res.status.mockReset();
        res.status.mockReturnValue({
            send: jest.fn()
        });
        next.mockReset();
        createComment.mockReset();
        const req = {
            headers: {
                'x-github-event': 'issues'
            },
            body: {
                ...request.body,
                action: 'opened'
            }
        };
        await hasConfig(req, res, next);
        expect(createComment).toHaveBeenCalledWith({
            req,
            body: `Git2Gus App is installed but the \`.git2gus/config.json\` doesn't have right values. You should add the required configuration.`
        });
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.status().send).toHaveBeenCalledWith({
            status: 403,
            message: 'get config error'
        });
    });
    it('should call createComment with the right values when error status is other than 404 and a pull request is opened', async () => {
        expect.assertions(4);
        getConfig.mockReset();
        getConfig.mockReturnValue(
            Promise.reject({
                status: 403,
                message: 'get config error'
            })
        );
        res.status.mockReset();
        res.status.mockReturnValue({
            send: jest.fn()
        });
        next.mockReset();
        createComment.mockReset();
        const req = {
            headers: {
                'x-github-event': 'pull_request'
            },
            body: {
                ...request.body,
                action: 'opened'
            }
        };
        await hasConfig(req, res, next);
        expect(createComment).toHaveBeenCalledWith({
            req,
            body: `Git2Gus App is installed but the \`.git2gus/config.json\` doesn't have right values. You should add the required configuration.`
        });
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.status().send).toHaveBeenCalledWith({
            status: 403,
            message: 'get config error'
        });
    });
    it('should respond with status 403 when error.status is other than 404', async () => {
        expect.assertions(4);
        next.mockReset();
        createComment.mockReset();
        res.status.mockReset();
        res.status.mockReturnValue({
            send: jest.fn()
        });
        getConfig.mockReset();
        getConfig.mockReturnValue(
            Promise.reject({
                status: 403,
                message: 'config error'
            })
        );
        const req = {
            ...request,
            headers: {
                'x-github-event': 'label'
            }
        };
        await hasConfig(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.status().send).toHaveBeenCalledWith({
            status: 403,
            message: 'config error'
        });
        expect(next).not.toHaveBeenCalled();
        expect(createComment).not.toHaveBeenCalled();
    });
    it('should call createComment with the right values when error status is 404 and an issue is opened', async () => {
        expect.assertions(3);
        getConfig.mockReset();
        getConfig.mockReturnValue(
            Promise.reject({
                status: 404,
                message: 'error message'
            })
        );
        res.notFound.mockReset();
        next.mockReset();
        createComment.mockReset();
        const req = {
            headers: {
                'x-github-event': 'issues'
            },
            body: {
                ...request.body,
                action: 'opened'
            }
        };
        await hasConfig(req, res, next);
        expect(createComment).toHaveBeenCalledWith({
            req,
            body: `Git2Gus App is installed but the \`.git2gus/config.json\` doesn't exists.`
        });
        expect(res.notFound).toHaveBeenCalledWith({
            status: 'CONFIG_NOT_FOUND',
            message: 'The .git2gus/config.json was not found.'
        });
        expect(next).not.toHaveBeenCalled();
    });
    it('should call createComment with the right values when error status is 404 and a pull request is opened', async () => {
        expect.assertions(3);
        getConfig.mockReset();
        getConfig.mockReturnValue(
            Promise.reject({
                status: 404,
                message: 'error message'
            })
        );
        res.notFound.mockReset();
        next.mockReset();
        createComment.mockReset();
        const req = {
            headers: {
                'x-github-event': 'pull_request'
            },
            body: {
                ...request.body,
                action: 'opened'
            }
        };
        await hasConfig(req, res, next);
        expect(createComment).toHaveBeenCalledWith({
            req,
            body: `Git2Gus App is installed but the \`.git2gus/config.json\` doesn't exists.`
        });
        expect(res.notFound).toHaveBeenCalledWith({
            status: 'CONFIG_NOT_FOUND',
            message: 'The .git2gus/config.json was not found.'
        });
        expect(next).not.toHaveBeenCalled();
    });
});
