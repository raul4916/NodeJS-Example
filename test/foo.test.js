const assert = require('assert');
const JobQueue = require('./lib/jobQueue')


const job = new JobQueue();

it('should return a job', function () {
    const actual = job.add('hello', 'goodbye');
    const expected = "{ runtime: \d+\.\d+," +
        "    dateCreated: \d+\.\d+," +
        "path: goodbye," +
        "user: 'hello' }";

    assertTrue(expected, 'yep, it returned bar');

}




