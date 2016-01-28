# hubot-github-issue-label-notifier
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

A Hubot plugin for alerts in your chat for GitHub issue labels.

## Basic setup

- `npm install hubot-github-issue-label-notifier --save`
- Add the script to your Hubot using **external-scripts.json**.
- Set the `HUBOT_GITHUB_NOTIFIER_SECRET` environment variable to a secret key. Choose something secure!
- Optionally: Set a `HUBOT_GITHUB_NOTIFIER_LABEL_FILTER` environment variable with a filter for issues. Without a filter, all labels are used. Multiple values are comma separated.

## Contributing

Have an idea? Let's talk about it in an issue!

Find a bug? Open an issue or submit a pull request. For code contributions, please submit a test or tests if possible. Tests are ran with `npm test`.

## Releasing

Update the version in [package.json](https://github.com/ritterim/hubot-github-issue-label-notifier/blob/master/package.json) and create a matching release on GitHub *(please follow the tag pattern as the other releases)*. The new release is published automatically to npm as [hubot-github-issue-label-notifier][npm-url] by Travis CI when tags are applied.

## Licence

MIT © Ritter Insurance Marketing


[npm-image]: https://badge.fury.io/js/hubot-github-issue-label-notifier.svg
[npm-url]: https://npmjs.org/package/hubot-github-issue-label-notifier
[travis-image]: https://travis-ci.org/ritterim/hubot-github-issue-label-notifier.svg?branch=master
[travis-url]: https://travis-ci.org/ritterim/hubot-github-issue-label-notifier
[daviddm-image]: https://david-dm.org/ritterim/hubot-github-issue-label-notifier.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/ritterim/hubot-github-issue-label-notifier
