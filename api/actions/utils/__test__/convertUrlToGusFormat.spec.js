/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { convertUrlToGusFormat } = require('../convertUrlToGusFormat');

describe('convertUrlToGusFormat', () => {
    it('should get the relative path of the pull request', () => {
        expect(
            convertUrlToGusFormat(
                'https://github.com/jag-j/git2gustest/pull/130'
            )
        ).toEqual('jag-j/git2gustest/pull/130');
    });
});
