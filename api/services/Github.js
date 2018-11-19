const conventionalLabelsMap = {
    bug: true,
    story: true,
    chore: true,
    test: true,
    docs: true,
};

module.exports = {
    async removeConventionalLabels({ octokitClient, owner, repo, number }) {
        const labels = await octokitClient.issues.getIssueLabels({ owner, repo, number });

        if (labels.data && labels.data.length) {
            labels.data.forEach(async ({ name }) => {
                const isConventionalLabel = conventionalLabelsMap[name];
                if (isConventionalLabel) {
                    await octokitClient.issues.removeLabel({ owner, repo, number, name });
                }
            });
        }
    },
    async getConfig({ octokitClient, owner, repo }) {
        const file = await octokitClient.repos.getContent({ owner, repo, path: '.git2gus/config.json' });
        const buffer = Buffer.from(file.data.content, 'base64');
        const jsonData = buffer.toString();
        const config = JSON.parse(jsonData);
        const isRightConfig = typeof config === 'object' && config !== null && config.productTag && config.defaultBuild;
        if (isRightConfig) {
            return {
                builds: [],
                ...config,
            };
        }
        return Promise.reject({
            code: 'BAD_CONFIG_FILE',
            message: 'Wrong config received.',
        });
    },
    createTable({ data = [], columns = [] }) {
        let tableHeader = '|';
        columns.forEach(({ label }) => {
            tableHeader += ` ${label} |`;
        });

        let tableHeaderSeparator = '|';
        columns.forEach(() => {
            tableHeaderSeparator += ' --- |';
        });

        let tableBody = '';
        data.forEach((item) => {
            tableBody += '\n|';
            columns.forEach(({ fieldName }) => {
                tableBody += ` ${item[fieldName]} |`;
            });
        });

        if (data.length && columns.length) {
            return `${tableHeader}\n${tableHeaderSeparator}${tableBody}`;
        }
        return null;
    },
};
