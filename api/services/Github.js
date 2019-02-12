module.exports = {
    async getConfig({ octokitClient, owner, repo }) {
        const file = await octokitClient.repos.getContents({ owner, repo, path: '.git2gus/config.json' });
        const buffer = Buffer.from(file.data.content, 'base64');
        const jsonData = buffer.toString();
        const config = JSON.parse(jsonData);
        const isRightConfig = typeof config === 'object' && config !== null && config.productTag && config.defaultBuild;
        if (isRightConfig) {
            return config;
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
    isGusLabel(name) {
        return sails.config.gus.labels.indexOf(name) !== -1;
    },
    getPriority(labels) {
        let priority;
        labels.forEach(({ name }) => {
            if (this.isGusLabel(name) && (priority === undefined || name[5] < priority[1])) {
                priority = `P${name[5]}`;
            }
        });
        return priority;
    }
};
