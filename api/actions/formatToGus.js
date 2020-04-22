const remark = require('remark');
const strip = require('strip-markdown');
const markdown = require('remark-parse');
function formatToGus(url, body) {
    var formattedDescription;
    remark()
        .use(markdown)
        .use(strip)
        .process(body, (err, file) => {
            if (err) {
                throw err;
            }
            formattedDescription = 'Github issue link: '.concat(
                url,
                '\n',
                String(file)
            );
        });
    return formattedDescription;
}
exports.formatToGus = formatToGus;
