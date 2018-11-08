const conventionalLabelsMap = {
    bug: true,
    story: true,
    chore: true,
    test: true,
    docs: true,
};

module.exports = {
    async addComment({ octokitClient, owner, repo, number, body }) {
        return octokitClient.issues.createComment({ owner, repo, number, body });
    },
    async removeConventionalLabels({ octokitClient, owner, repo, number }) {
        const labels = await octokitClient.issues.getIssueLabels({ owner, repo, number });

        if (labels.data && labels.data.length) {
            labels.data.forEach(({ name }) => {
                const isConventionalLabel = conventionalLabelsMap[name];
                if (isConventionalLabel) {
                    return octokitClient.issues.removeLabel({ owner, repo, number, name });
                }
                return null;
            });
        }
    },
    async addLabels({ octokitClient, owner, repo, number, labels }) {
        return octokitClient.issues.addLabels({ owner, repo, number, labels });
    },
};
