/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

const App = require('@octokit/app');
const Octokit = require('@octokit/rest');
const fs = require('fs');

module.exports.bootstrap = async function(done) {
    // By convention, this is a good place to set up fake data during development.
    //
    // For example:
    // ```
    // // Set up fake development data (or if we already have some, avast)
    // if (await User.count() > 0) {
    //   return done();
    // }
    //
    // await User.createEach([
    //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
    //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
    //   // etc.
    // ]);
    // ```

    // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
    // (otherwise your server will never lift, since it's waiting on the bootstrap)

    // Start smee
    const SmeeClient = require('smee-client');

    const smee = new SmeeClient({
        source: 'https://smee.io/rqJMaQ7bn8YzDLBr',
        target: 'http://localhost:1337/webhook',
        logger: console
    });

    smee.start();

    // Temporary Migration Script
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

    const app = new App({
        id: process.env.GITHUB_APP_ID,
        privateKey: cert
    });

    const appClient = new Octokit({
        auth() {
            return app.getSignedJsonWebToken();
        }
    });

    const investigationLabels = [
        'INVESTIGATION P0',
        'INVESTIGATION P1',
        'INVESTIGATION P2',
        'INVESTIGATION P3'
    ];

    appClient.apps.listInstallations().then(r => {
        // Access every installation of the GitHub application
        r.data.forEach(installation => {
            const installationClient = new Octokit({
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
            installationClient.apps.listRepos().then(repos => {
                // Access every repository using the GitHub application
                repos.data.repositories.forEach(repo => {
                    const owner = repo.owner.login;
                    const repoName = repo.name;

                    installationClient.issues
                        .listLabelsForRepo({
                            owner,
                            repo: repoName
                        })
                        .then(labels => {
                            // Update obsolete labels
                            labels.data.forEach(label => {
                                if (label.name.includes('GUS P')) {
                                    const priorityLevel = label.name[5];
                                    installationClient.issues.updateLabel({
                                        owner,
                                        repo: repoName,
                                        current_name: label.name,
                                        name: 'BUG P' + priorityLevel
                                    });
                                } else if (label.name === 'GUS STORY') {
                                    installationClient.issues.updateLabel({
                                        owner,
                                        repo: repoName,
                                        current_name: label.name,
                                        name: 'USER STORY'
                                    });
                                }
                            });

                            // Add investigation labels if not there
                            investigationLabels.forEach(investigationLabel => {
                                if (
                                    !labels.data.some(
                                        existingLabel =>
                                            existingLabel.name ===
                                            investigationLabel
                                    )
                                ) {
                                    installationClient.issues.createLabel({
                                        owner,
                                        repo: repoName,
                                        name: investigationLabel,
                                        color: 'd4a3f0'
                                    });
                                }
                            });
                        });
                });
            });
        });
        return done();
    });
};
