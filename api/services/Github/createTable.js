module.exports = function createTable({ data = [], columns = [] }) {
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
};
