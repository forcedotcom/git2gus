const GithubEvents = require('../modules/GithubEvents');
const Github =  require('../services/Github');

module.exports = {
    eventName: GithubEvents.events.ISSUE_OPENED,
    async fn(req) {
        await Github.createComment({
            req,
            body: `This repo has installed the Git2Gus application. If you want to know how it works navigate to https://lwc-gus-bot.herokuapp.com/#how-it-works`,
        });
    }
};
