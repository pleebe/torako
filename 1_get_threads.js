'use strict';

const api = require('./api.js');
const config = require('./config.json');

const async = require('async');
const fs = require('fs-extra');

let recovery;
let recovered = false;
let boards = config.boards;
fs.readJson('status.json', (statusReadErr, data) => {
    if (statusReadErr === null) {
        console.log('Continuing from previous recovery point (see status.json)...\n');
        recovery = data;
        recovered = true;
    }
    
    if (recovered)
        boards = boards.slice(boards.indexOf(recovery.board));

    fs.ensureDir('data/', (dirErr) => {
        if (dirErr === null)
            async.eachSeries(boards, (board, boardCb) => {
                let page = 1;
                if (recovered && board === recovery.board)
                    page = recovery.page + 1;
                let stream = fs.createWriteStream('data/' + board + '.json');
                stream.write('[');
                async.doWhilst((pageCb) => api.page(board, page, (err, data) => pageCb(err, data)), (data) => {
                    if (typeof data.length === 'undefined') {    
                        let out = Object.getOwnPropertyNames(data).map((num) => { return num * 1; }).join(',');
                        if (page > 1)
                            out = ',' + out;
                        stream.write(out);
                        fs.outputFileSync('status.json', JSON.stringify({ board: board, page: page }));
                        console.log('Downloaded page ' + page + ' for /' + board + '/');
                        page++;
                        return true;
                    } else if (typeof data.length !== 'undefined' && data.length === 0) {
                        fs.outputFileSync('status.json', JSON.stringify({ board: board, page: page }));
                        console.log('Downloaded page ' + page + ' for /' + board + '/');
                        return false;
                    }
                }, (err) => {
                    if (err === null)
                        stream.write(']');
                    stream.end();
                    boardCb(err);
                });
            }, (err) => {
                fs.remove('status.json', (err) => {
                    if (err !== null)
                        console.log(err);
                });
                console.log('\nDone!\n');
            });
        else
            console.log(err);
    });
});
