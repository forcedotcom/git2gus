module.exports = function shouldUsePersonalToken(url) {
    if (process.env.TOKEN_ORGS) {
        const tokenOrgs = process.env.TOKEN_ORGS.split(',');
        return tokenOrgs.some(org =>
            url.includes('https://api.github.com/repos/' + org + '/')
        );
    }
    return false;
};
