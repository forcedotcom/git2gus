module.exports = {
    routes: {
        'GET /issues': {
            controller: 'IssuesController',
            action: 'getAll',
        },
        'POST /issue': {
            controller: 'IssuesController',
            action: 'create',
        },
        'GET /issue/:id': {
            controller: 'IssuesController',
            action: 'getById',
        },
        'PUT /issue/:id': {
            controller: 'IssuesController',
            action: 'update',
        },
        'GET /build/:name': {
            controller: 'BuildsController',
            action: 'getBuildByName',
        },
    },
};
