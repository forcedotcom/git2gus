const remark = require('remark');
const toHtml = require('remark-html');
const markdown = require('remark-parse');
function formatToGus(url, body) {
    var formattedDescription;
    remark()
        .use(markdown)
        .use(toHtml)
        .process(body, (err, file) => {
            if (err) {
                throw err;
            }
            formattedDescription = 'Github issue link: '.concat(
                url,
                '\n',
                '<hr><hr>',
                String(file)
            );
        });
    return formattedDescription;
}
exports.formatToGus = formatToGus;
