'use strict';

process.env.EXPRESS_PORT = 13722;

let Helper = require('hubot-test-helper');
let helper = new Helper('../src/index.js');

let crypto = require('crypto');
let http = require('http');
let expect = require('chai').expect;

const addLabelFixture = JSON.stringify(require('./fixtures/addLabel'));
const issueOpenedFixture = JSON.stringify(require('./fixtures/issueOpened'));
const addLabelTwoLabelsFixture = JSON.stringify(require('./fixtures/addLabelTwoLabels'));

const secret = 'the-secret';

let addLabelFixturePostOptions = {
    hostname: 'localhost',
    port: process.env.EXPRESS_PORT,
    path: `/hubot/github-issue-label/general`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
};

let issueOpenedFixturePostOptions = JSON.parse(JSON.stringify(addLabelFixturePostOptions));
let addLabelTwoLabelsFixturePostOptions = JSON.parse(JSON.stringify(addLabelFixturePostOptions));

addLabelFixturePostOptions.headers['X-Hub-Signature'] = getDigest(addLabelFixture);
issueOpenedFixturePostOptions.headers['X-Hub-Signature'] = getDigest(issueOpenedFixture);
addLabelTwoLabelsFixturePostOptions.headers['X-Hub-Signature'] = getDigest(addLabelTwoLabelsFixture);

function getDigest(fixture) {
    return crypto.createHmac('sha1', secret).update(fixture).digest('hex');
}

describe('hubot', () => {
    let room;

    beforeEach(() => {
        process.env.HUBOT_GITHUB_NOTIFIER_SECRET = secret;
        process.env.HUBOT_GITHUB_NOTIFIER_LABEL_FILTER = undefined;

        room = helper.createRoom();
    });

    afterEach(() => {
        room.destroy();
    });

    it('should return 500 when HUBOT_GITHUB_NOTIFIER_SECRET is not configured', (done) => {
        delete process.env.HUBOT_GITHUB_NOTIFIER_SECRET;

        let req = http.request(addLabelFixturePostOptions, (res) => {
            expect(res.statusCode).to.equal(500);
            done();
        });

        req.write(addLabelFixture);
        req.end();
    });

    it('should return 401 when HUBOT_GITHUB_NOTIFIER_SECRET does not match environment variable', (done) => {
        process.env.HUBOT_GITHUB_NOTIFIER_SECRET = 'different-secret';

        let req = http.request(addLabelFixturePostOptions, (res) => {
            expect(res.statusCode).to.equal(401);
            done();
        });

        req.write(addLabelFixture);
        req.end();
    });

    it('should return 200 when HUBOT_GITHUB_NOTIFIER_SECRET matches environment variable', (done) => {
        let req = http.request(addLabelFixturePostOptions, (res) => {
            expect(res.statusCode).to.equal(200);
            done();
        });

        req.write(addLabelFixture);
        req.end();
    });

    it('should display expected message in requested channel for labeled request with 1 matching label', (done) => {
        process.env.HUBOT_GITHUB_NOTIFIER_LABEL_FILTER = 'bug';

        let req = http.request(addLabelFixturePostOptions, (res) => {
            expect(room.messages).to.eql([
                ['hubot', "Label applied 'Spelling error in the README file' (bug) https://github.com/baxterthehacker/public-repo/issues/2"]
            ]);
            done();
        });

        req.write(addLabelFixture);
        req.end();
    });

    it('should display expected message in requested channel for labeled request with 2 labels with 1 match', (done) => {
        process.env.HUBOT_GITHUB_NOTIFIER_LABEL_FILTER = 'bug, test'

        let req = http.request(addLabelFixturePostOptions, (res) => {
            expect(room.messages).to.eql([
                ['hubot', "Label applied 'Spelling error in the README file' (bug) https://github.com/baxterthehacker/public-repo/issues/2"]
            ]);
            done();
        });

        req.write(addLabelFixture);
        req.end();
    });

    it('should display expected message in requested channel for labeled request with 2 labels with 2 matches', (done) => {
        process.env.HUBOT_GITHUB_NOTIFIER_LABEL_FILTER = 'bug, test'

        let req = http.request(addLabelTwoLabelsFixturePostOptions, (res) => {
            expect(room.messages).to.eql([
                ['hubot', "Label applied 'Spelling error in the README file' (bug, test) https://github.com/baxterthehacker/public-repo/issues/2"]
            ]);
            done();
        });

        req.write(addLabelTwoLabelsFixture);
        req.end();
    });

    it('should not display any message in requested channel for labeled request with 0 matching labels', (done) => {
        process.env.HUBOT_GITHUB_NOTIFIER_LABEL_FILTER = 'non-matching';

        let req = http.request(addLabelFixturePostOptions, (res) => {
            expect(room.messages).to.eql([]);
            done();
        });

        req.write(addLabelFixture);
        req.end();
    });

    it('should not display any message for non-labeled request', (done) => {
        let req = http.request(issueOpenedFixturePostOptions, (res) => {
            expect(room.messages).to.eql([]);
            done();
        });

        req.write(issueOpenedFixture);
        req.end();
    });
});
