// Description:
//   Notify when a GitHub issue has a label applied.
// Dependencies:
//   None
// Configuration:
//   HUBOT_GITHUB_NOTIFIER_TOKEN
//   HUBOT_GITHUB_NOTIFIER_LABEL_FILTER (optional, comma seperated)
// Commands:
//   None
// Notes:
//   This script listens for webhooks configured on GitHub.
//   Configure the GitHub webhooks to submit to:
//   https://example.com/hubot/github-issue-label/room-name-here?token=HUBOT_GITHUB_NOTIFIER_TOKEN_VALUE_HERE
// Author:
//   ritterim

'use strict';

module.exports = (robot) => {
    robot.router.post('/hubot/github-issue-label/:room', (req, res, next) => {
        if (!process.env.HUBOT_GITHUB_NOTIFIER_TOKEN) {
            robot.logger.error('HUBOT_GITHUB_NOTIFIER_TOKEN environment variable is not specified.');

            res.status(500);
            res.send('Configuration is required.');
        }
        else if (req.query.token !== process.env.HUBOT_GITHUB_NOTIFIER_TOKEN) {
            robot.logger.warning(`Invalid token specified in ${req.url}.`);

            res.status(401);
            res.send('Unauthorized');
        }
        else if (req.body.action === 'labeled') {
            let labelFilter = process.env.HUBOT_GITHUB_NOTIFIER_LABEL_FILTER.split(',').map(x => x.trim());

            let issue = req.body.issue;
            let labelNames = issue.labels.length > 0 ? issue.labels.map(x => x.name.trim()) : [];
console.log(labelFilter);
            // If no label filter or there's any intersection between notifier labels and issue labels
            if (!labelFilter || labelFilter.some(x => labelNames.indexOf(x) !== -1)) {
                let message = `GitHub issue '${issue.title}' includes these labels: ${issue.labels.map(x => x.name).sort().join(', ')}. ${issue.url}`;
                robot.send({ room: req.params.room }, message);
            }

            res.send('ok');
        }
        else {
            res.send('ok');
        }
    });
};
