/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const Octokit = require('@octokit/rest');
const App = require('@octokit/app');
const fs = require('fs');
const { github } = require('../../config/github');

let cert;
try {
    cert = process.env.PRIVATE_KEY || fs.readFileSync('private-key.pem');
} catch (error) {
    console.error(error);
    throw new Error(`
        Failed reading Github App private key.
        Private key should be as PRIVATE_KEY environment variable or in private-key.pem file at the root folder.
    `);
}

module.exports = async function isGithubAuth(req, res, next) {
    const PERSONAL_ACCESS_TOKEN = process.env.PERSONAL_ACCESS_TOKEN;
    const { installation } = req.body;
    const app = new App({
        id: github.appId,
        privateKey: cert
    });
    const octokitClient = PERSONAL_ACCESS_TOKEN
        ? new Octokit({ auth: PERSONAL_ACCESS_TOKEN })
        : new Octokit({
            async auth() {
                let installationAccessToken;
                try {
                    installationAccessToken = await app.getInstallationAccessToken(
                        {
                            installationId: installation.id
                        }
                    );
                } catch (error) {
                    console.error(error);
                    return res.status(401).send({
                        status: 'UNAUTHORIZED_REQUEST',
                        message: 'The request requires authentication.'
                    });
                }
                return `token ${installationAccessToken}`;
            }
        });
    req.octokitClient = octokitClient;
    next();
};
