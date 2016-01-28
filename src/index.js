// Description:
//   Notify when a GitHub issue has a label applied.
// Dependencies:
//   None
// Configuration:
//   HUBOT_GITHUB_NOTIFIER_SECRET
//   HUBOT_GITHUB_NOTIFIER_LABEL_FILTER (optional, comma seperated)
// Commands:
//   None
// Notes:
//   This script listens for webhooks configured on GitHub.
//   Configure the GitHub webhooks to submit to:
//   https://example.com/hubot/github-issue-label/room-name-here
// Author:
//   ritterim

'use strict';

let crypto = require('crypto');
let bufferEq = require('buffer-equal-constant-time');

module.exports = (robot) => {
    robot.router.post('/hubot/github-issue-label/:room', (req, res, next) => {
        if (!process.env.HUBOT_GITHUB_NOTIFIER_SECRET) {
            robot.logger.error('HUBOT_GITHUB_NOTIFIER_SECRET environment variable is not specified.');

            res.status(500);
            res.send('Configuration is required.');
        }
        else if (!signatureValid(req)) {
            robot.logger.warning(`Invalid secret specified in ${req.url}.`);

            res.status(401);
            res.send('Unauthorized');
        }
        else if (req.body.action === 'labeled') {
            let labelFilter = process.env.HUBOT_GITHUB_NOTIFIER_LABEL_FILTER.split(',').map(x => x.trim());

            let issue = req.body.issue;
            let labelNames = issue.labels.length > 0 ? issue.labels.map(x => x.name.trim()) : [];

            // If no label filter or there's any intersection between notifier labels and issue labels
            if (!labelFilter || labelFilter.some(x => labelNames.indexOf(x) !== -1)) {
                let message = `GitHub issue '${issue.title}' includes these labels: ${issue.labels.map(x => x.name).sort().join(', ')}. ${issue.html_url}`;
                robot.send({ room: req.params.room }, message);
            }

            res.send('ok');
        }
        else {
            res.send('ok');
        }
    });

    function signatureValid(req) {
        // http://stackoverflow.com/a/7480211
        let expected = crypto.createHmac('sha1', process.env.HUBOT_GITHUB_NOTIFIER_SECRET)
          .update(JSON.stringify(req.body))
          .digest('hex');

        return bufferEq(
          new Buffer(req.headers['x-hub-signature']),
          new Buffer(expected));
    };
};
