const shouldUsePersonalToken = require('../../services/Github/shouldUsePersonalToken');

module.exports = async function getConfig({
    octokitTokenClient,
    octokitClient,
    owner,
    repo,
    repoUrl
}) {
    const file = shouldUsePersonalToken(repoUrl)
        ? await octokitTokenClient.repos.getContents({
              owner,
              repo,
              path: '.git2gus/config.json'
          })
        : await octokitClient.repos.getContents({
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
        config.productTag &&
        config.defaultBuild;
    if (isRightConfig) {
        return config;
    }
    return Promise.reject({
        status: 'BAD_CONFIG_FILE',
        message: 'Wrong config received.'
    });
};
