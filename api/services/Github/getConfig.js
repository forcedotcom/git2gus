module.exports = async function getConfig({ octokitClient, owner, repo }) {
    const file = await octokitClient.repos.getContents({
        owner,
        repo,
        path: '.git2gus/config.json'
    });
    const buffer = Buffer.from(file.data.content, 'base64');
    const jsonData = buffer.toString();
    const config = JSON.parse(jsonData);
    const isRightConfig =
        typeof config === 'object' &&
        config !== null &&
        (config.productTag || config.productTagLabels) &&
        config.defaultBuild;
    if (isRightConfig) {
        return config;
    }
    return Promise.reject({
        status: 'BAD_CONFIG_FILE',
        message: 'Wrong config received.'
    });
};
