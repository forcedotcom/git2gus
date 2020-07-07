/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { convertUrlToGusFormat } = require('../convertUrlToGusFormat');

describe('convertUrlToGusFormat', () => {
    it('should use merged commit when present - squash & merge case', () => {
        expect(
            convertUrlToGusFormat(
                'repo-url.com/repo1',
                '123456',
                'pr-url.com/pull/199',
                '654321'
            )
        ).toEqual('repo-url.com/repo1/commit/123456');
    });

    it('should use first commit when merged commit not present - non squashed merge case', () => {
        expect(
            convertUrlToGusFormat(
                'repo-url.com/repo1',
                null,
                'pr-url.com/pull/199',
                '654321'
            )
        ).toEqual('pr-url.com/pull/199/commits/654321');
    });
});
