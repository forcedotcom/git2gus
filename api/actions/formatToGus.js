const remark = require('remark');
const toHtml = require('remark-html');
const markdown = require('remark-parse');

// Salesforce Long Text Area default limit is 32,768 characters
// Account for HTML expansion (~3x) and prepended text (~100 chars)
const MAX_MARKDOWN_LENGTH = 10000; // Conservative limit to ensure we stay under 32,768 after HTML conversion

function formatToGus(url, body) {
    var formattedDescription;
    let processedBody = body || '';

    // Truncate markdown if it exceeds the limit
    if (processedBody.length > MAX_MARKDOWN_LENGTH) {
        const truncationMessage = '\n\n---\n**[Content truncated due to length. See full issue on GitHub]**';
        processedBody = processedBody.substring(0, MAX_MARKDOWN_LENGTH - truncationMessage.length) + truncationMessage;
    }

    remark()
        .use(markdown)
        .use(toHtml)
        .process(processedBody, (err, file) => {
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
