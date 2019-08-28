/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

module.exports = function createTable({ data = [], columns = [] }) {
    let tableHeader = '|';
    columns.forEach(({ label }) => {
        tableHeader += ` ${label} |`;
    });

    let tableHeaderSeparator = '|';
    columns.forEach(() => {
        tableHeaderSeparator += ' --- |';
    });

    let tableBody = '';
    data.forEach(item => {
        tableBody += '\n|';
        columns.forEach(({ fieldName }) => {
            tableBody += ` ${item[fieldName]} |`;
        });
    });

    if (data.length && columns.length) {
        return `${tableHeader}\n${tableHeaderSeparator}${tableBody}`;
    }
    return null;
};
