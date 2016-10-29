'use strict';

const api = require('./api.js');
const config = require('./config.json');

const async = require('async');
const fs = require('fs-extra');

fs.ensureDir('data/', (dirErr) => {
    if (dirErr === null)
        async.eachSeries(config.boards, (board, boardCb) => {
            let page = 1;
            let stream = fs.createWriteStream('data/' + board + '.json');
            stream.write('[');
            async.doWhilst((pageCb) => api.page(board, page, (err, data) => pageCb(err, data)), (data) => {
                console.log('Downloaded page ' + page + ' for /' + board + '/');
                if (typeof data.length === 'undefined') {    
                    let out = Object.getOwnPropertyNames(data).map((num) => { return num * 1; }).join(',');
                    if (page > 1)
                        out = ',' + out;
                    stream.write(out);
                    page++;
                    return true;
                } else if (typeof data.length !== 'undefined' && data.length === 0)
                    return false;
            }, (err) => {
                stream.write(']');
                stream.end();
                boardCb(err);
            });
        }, (err) => {
            console.log('\nDone!\n');
        });
    else
        console.log(err);
});