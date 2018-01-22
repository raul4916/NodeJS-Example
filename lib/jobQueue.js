const Hapi = require('hapi');
const Kue = require('kue');

const DONE = 0;
const RUNNING = 1;
const PENDING = 2;
const PAUSED = 3;
const ERROR = 4;

var queue = Kue.createQueue();
var active = [];
var inactive = [];
var delayed = [];
var complete = [];
var failed = [];
exports = module.exports = JobQueue;

function JobQueue() {
    queue.process('job', 2, function (job, done) {
        active.push(job);

        setTimeout(function () {
            var id = active.indexOf(job);
            active.splice(id);
            complete.push(job);
        }, job.data.runtime);

        done();
    });
}

JobQueue.prototype.get = function (id) {
    var result;

    if (typeof id != "undefined") {
        Kue.Job.get(id, function (err, job) {
            if (err) {
                result = {error: "ERROR"};
            } else {
                result = job;
            }
        });
    } else {
        result = {
            active: active,
            inactive: inactive,
            delayed: delayed,
            complete: complete,
            failed: failed
        }
    }

    return result;

}

JobQueue.prototype.add = function (user, path) {
    var runtime = Math.random()*15000;
    var currTime = new Date().getTime() / 1000;

    var job = {runtime: runtime, dateCreated: currTime, path: path, user: user};

    queue.create('job', job).save(function (err) {
        if (!err) {
        }
    });

    return job;
};

JobQueue.prototype.clearJobs = function () {


    Kue.Job.rangeByType('job','complete', 0, 1000, 'asc', function (err, selectedJobs) {
        selectedJobs.forEach(function (job) {
            var id = complete.indexOf(job);
            complete.splice(id);
        });
    });
};


JobQueue.prototype.queueJobs = function (jobs) {
    jobs.forEach(function (element) {
        queue.create('job', element);
    });


};

var inArray = function (needle, haystack) {
    var len = haystack.length
    for (var i = 0; i < len; i++) {
        if (haystack[i] == needle) {
            return true;
        }
    }
    return false;
};