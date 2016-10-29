'use strict';

const api = require('./api.js');
const config = require('./config.json');

const async = require('async');
const fs = require('fs-extra');

async.eachSeries(config.boards, (board, boardCb) => {
    async.eachSeries(require('./data/' + board + '.json'), (thread, threadCb) => {
        api.thread(board, thread, (err, data) => {
            console.log('Downloaded thread ' + thread + ' for /' + board + '/');
            if (err === null)
                fs.outputFile('data/' + board + '/' + (thread + '').match(/.{1,4}/g).join('/') + '/' + thread + '.json', JSON.stringify(data), (fileErr) => {
                    console.log('Wrote thread ' + thread);
                    threadCb(fileErr);
                });
            else
                threadCb(err);
        });
    }, (err) => {
        boardCb(err);
    });
});