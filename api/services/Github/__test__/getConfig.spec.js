/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const getConfig = require('../getConfig');

const payload = {
    octokitClient: {
        repos: {
            getContent: jest.fn()
        }
    },
    owner: 'john',
    repo: 'test-repo'
};

describe('getConfig github service', () => {
    it('should call getContents with the right values', () => {
        const content = Buffer.from(
            '{\n  "productTag": "abcd1234",\n  "defaultBuild": "218"\n}\n'
        ).toString('base64');
        const fileData = {
            data: {
                content
            }
        };
        payload.octokitClient.repos.getContent.mockReturnValue(
            Promise.resolve(fileData)
        );
        getConfig(payload);
        expect(payload.octokitClient.repos.getContent).toHaveBeenCalledWith({
            owner: 'john',
            repo: 'test-repo',
            path: '.git2gus/config.json'
        });
    });
    it('should return the right configuration', async () => {
        expect.assertions(1);
        const content = Buffer.from(
            '{\n  "productTag": "abcd1234",\n  "defaultBuild": "218"\n}\n'
        ).toString('base64');
        const fileData = {
            data: {
                content
            }
        };
        payload.octokitClient.repos.getContent.mockReturnValue(
            Promise.resolve(fileData)
        );
        const configData = await getConfig(payload);
        expect(configData).toEqual({
            defaultBuild: '218',
            productTag: 'abcd1234'
        });
    });
    it('should rejects when there is not defaultBuild', () => {
        expect.assertions(1);
        const content = Buffer.from(
            '{\n  "productTag": "abcd1234"\n}\n'
        ).toString('base64');
        const fileData = {
            data: {
                content
            }
        };
        payload.octokitClient.repos.getContent.mockReturnValue(
            Promise.resolve(fileData)
        );
        return expect(getConfig(payload)).rejects.toEqual({
            status: 'BAD_CONFIG_FILE',
            message: 'Wrong config received.'
        });
    });
    it('should rejects when there is not productTag', () => {
        expect.assertions(1);
        const content = Buffer.from('{\n  "defaultBuild": "218"\n}\n').toString(
            'base64'
        );
        const fileData = {
            data: {
                content
            }
        };
        payload.octokitClient.repos.getContent.mockReturnValue(
            Promise.resolve(fileData)
        );
        return expect(getConfig(payload)).rejects.toEqual({
            status: 'BAD_CONFIG_FILE',
            message: 'Wrong config received.'
        });
    });
    it('should rejects when the content is null', () => {
        expect.assertions(1);
        const content = Buffer.from('null').toString('base64');
        const fileData = {
            data: {
                content
            }
        };
        payload.octokitClient.repos.getContent.mockReturnValue(
            Promise.resolve(fileData)
        );
        return expect(getConfig(payload)).rejects.toEqual({
            status: 'BAD_CONFIG_FILE',
            message: 'Wrong config received.'
        });
    });
    it('should rejects when the content is not an object', () => {
        expect.assertions(1);
        const content = Buffer.from('"some string"').toString('base64');
        const fileData = {
            data: {
                content
            }
        };
        payload.octokitClient.repos.getContent.mockReturnValue(
            Promise.resolve(fileData)
        );
        return expect(getConfig(payload)).rejects.toEqual({
            status: 'BAD_CONFIG_FILE',
            message: 'Wrong config received.'
        });
    });
});
