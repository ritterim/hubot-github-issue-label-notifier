'use strict';

process.env.EXPRESS_PORT = 13722;

let Helper = require('hubot-test-helper');
let helper = new Helper('../src/index.js');

let http = require('http');
let expect = require('chai').expect;

let addLabelFixture = JSON.stringify(require('./fixtures/addLabel'));
let issueOpenedFixture = JSON.stringify(require('./fixtures/issueOpened'));
let addLabelTwoLabelsFixture = JSON.stringify(require('./fixtures/addLabelTwoLabels'));

let postOptions = {
    hostname: 'localhost',
    port: process.env.EXPRESS_PORT,
    path: `/hubot/github-issue-label/general`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
};

describe('hubot', () => {
    let room;

    beforeEach(() => {
        process.env.HUBOT_GITHUB_NOTIFIER_LABEL_FILTER = undefined;

        room = helper.createRoom();
    });

    afterEach(() => {
        room.destroy();
    });

    it('should display expected message in requested channel for labeled request with 1 matching label', (done) => {
        process.env.HUBOT_GITHUB_NOTIFIER_LABEL_FILTER = 'bug';

        let req = http.request(postOptions, (res) => {
            expect(room.messages).to.eql([
                ['hubot', "GitHub issue 'Spelling error in the README file' includes these labels: bug. https://api.github.com/repos/baxterthehacker/public-repo/issues/2"]
            ]);
            done();
        });

        req.write(addLabelFixture);
        req.end();
    });

    it('should display expected message in requested channel for labeled request with 2 labels with 1 match', (done) => {
        process.env.HUBOT_GITHUB_NOTIFIER_LABEL_FILTER = 'bug, test'

        let req = http.request(postOptions, (res) => {
            expect(room.messages).to.eql([
                ['hubot', "GitHub issue 'Spelling error in the README file' includes these labels: bug. https://api.github.com/repos/baxterthehacker/public-repo/issues/2"]
            ]);
            done();
        });

        req.write(addLabelFixture);
        req.end();
    });

    it('should display expected message in requested channel for labeled request with 2 labels with 2 matches', (done) => {
        process.env.HUBOT_GITHUB_NOTIFIER_LABEL_FILTER = 'bug, test'

        let req = http.request(postOptions, (res) => {
            expect(room.messages).to.eql([
                ['hubot', "GitHub issue 'Spelling error in the README file' includes these labels: bug, test. https://api.github.com/repos/baxterthehacker/public-repo/issues/2"]
            ]);
            done();
        });

        req.write(addLabelTwoLabelsFixture);
        req.end();
    });

    it('should not display any message in requested channel for labeled request with 0 matching labels', (done) => {
        process.env.HUBOT_GITHUB_NOTIFIER_LABEL_FILTER = 'non-matching';

        let req = http.request(postOptions, (res) => {
            expect(room.messages).to.eql([]);
            done();
        });

        req.write(addLabelFixture);
        req.end();
    });

    it('should not display any message for non-labeled request', (done) => {
        let req = http.request(postOptions, (res) => {
            expect(room.messages).to.eql([]);
            done();
        });

        req.write(issueOpenedFixture);
        req.end();
    });
});
