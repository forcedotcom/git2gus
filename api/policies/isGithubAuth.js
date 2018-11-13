const octokit = require('@octokit/rest');
const jwt = require('jsonwebtoken');
const fs = require('fs');

let cert;
try {
    cert = process.env.PRIVATE_KEY || fs.readFileSync('private-key.pem');
} catch(err) {
    throw new Error(`
        Failed reading Github App private key.
        Private key should be as PRIVATE_KEY environment variable or in private-key.pem file at the root folder. 
        `);
}

function generateJwt(appId) {
    const payload = {
        exp: Math.floor(Date.now() / 1000) + 60,  // JWT expiration time
        iat: Math.floor(Date.now() / 1000),       // Issued at time
        iss: appId                                // GitHub App ID
    };
    // Sign with RSA SHA256
    return jwt.sign(payload, cert, { algorithm: 'RS256' })
}

module.exports = async function isGithubAuth(req, res, next) {
    const { installation } = req.body;
    const octokitClient = octokit();

    octokitClient.authenticate({
        type: 'app',
        token: generateJwt(process.env.GITHUB_APP_ID),
    });

    let installationAccessToken;
    try {
        installationAccessToken = await octokitClient.apps.createInstallationToken({ installation_id: installation.id });
    } catch(err) {
        return res.status(403).send(err);
    }

    octokitClient.authenticate({
        type: 'token',
        token: installationAccessToken.data.token,
    });
    req.octokitClient = octokitClient;
    next();
};
