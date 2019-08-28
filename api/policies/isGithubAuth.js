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

function shouldUsePersonalToken(fullName) {
    const orgName = fullName.split('/')[0];
    if (process.env.TOKEN_ORGS) {
        const tokenOrgs = process.env.TOKEN_ORGS.split(',');
        return tokenOrgs.some(tokenOrgName => tokenOrgName === orgName);
    }
    return false;
}

module.exports = async function isGithubAuth(req, res, next) {
    const { installation, repository, repositories } = req.body;
    const app = new App({
        id: github.appId,
        privateKey: cert
    });
    const repositoryName = (repositories && repositories[0] && repositories[0].full_name) ? repositories[0].full_name : repository.full_name;
    // pretier-ignore
    const octokitClient = (repository && shouldUsePersonalToken(repositoryName))
        ? new Octokit({ auth: process.env.PERSONAL_ACCESS_TOKEN })
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
