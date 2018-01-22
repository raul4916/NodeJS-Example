const Server = require('hapi').Server;
const loadPlugins = require('./lib/loadPlugins');
const JobQueue = require('./lib/jobQueue')
const server = new Server();

server.connection({port: 9000,     routes: { cors: true }});


var jobQueue = new JobQueue();

function code() {
    server.route({
        method: 'GET',
        path: '/jobs',
        handler: function (request, reply) {

            reply(jobQueue.get(request.query.id));
        },
        config: {

            description: 'get the jobs',
            tags: ['api']
        }
    });
    server.route({
        method: 'POST',
        path: '/jobs',
        handler: function (request, reply) {
            console.log(request.payload.user);

            reply(jobQueue.add(request.payload.user, request.payload.path));
        },
        config: {
            description: 'get the jobs',
            tags: ['api']
        }
    });

    server.route({
        method: 'DELETE',
        path: '/jobs',
        handler: function (request, reply) {
            reply(jobQueue.clearJobs());
        },
        config: {
            description: 'get the jobs',
            tags: ['api']
        }
    });

    // server.route({
    //     method: 'GET',
    //     path: '/jobs/pause',
    //     handler: function (request, reply) {
    //         reply(jobQueue.pause());
    //     },
    //     config: {
    //         description: 'get the jobs',
    //         tags: ['api']
    //     }
    // });
    //
    // server.route({
    //     method: 'GET',
    //     path: '/jobs/resume',
    //     handler: function (request, reply) {
    //         reply(jobQueue.resume());
    //     },
    //     config: {
    //         description: 'get the jobs',
    //         tags: ['api']
    //     }
    // });
}


function startServer() {
    server.start(() => {
        server.log(
            ['sampleProject', 'info'],
            `Server running at: ${server.info.uri}`
        );
    });
}

function logErrors(err) {
    server.log(['sampleProject', 'error'], err);
}

// Loading Production plugins.
// devMode plugins are conditionally loaded.
loadPlugins(server, process.env.NODE_ENV === 'development')
    .then(code)
    .then(startServer)
    .catch(logErrors);
