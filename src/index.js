// Description:
//   Notify when a GitHub issue has a label applied.
// Dependencies:
//   None
// Configuration:
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

module.exports = (robot) => {
    robot.router.post('/hubot/github-issue-label/:room', (req, res, next) => {
      if (req.body.action === 'labeled') {
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
