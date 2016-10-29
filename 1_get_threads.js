'use strict';

const api = require('./api.js');
const config = require('./config.json');

const async = require('async');
const fs = require('fs-extra');

async.eachSeries(config.boards, (board, boardCb) => {
    let page = 4140;
    let threads = [];
    async.doWhilst((pageCb) => api.page(board, page, (err, data) => pageCb(err, data)), (data) => {
        console.log('Downloaded page ' + page);
        if (typeof data.length === 'undefined') {
            threads = threads.concat(Object.getOwnPropertyNames(data).map((num) => { return num * 1; }));
            page++;
            return true;
        } else if (typeof data.length !== 'undefined' && data.length === 0)
            return false;
    }, (err) => {
        if (err === null)
            fs.outputFile('data/' + board + '.json', JSON.stringify(threads), (fileErr) => {
                boardCb(fileErr);
            });
        else
            boardCb(err);
    });
}, (err) => {
    console.log('\nDone!\n');
});