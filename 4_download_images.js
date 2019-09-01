'use strict';

const api = require('./api.js');
const config = require('./config.json');

const async = require('async');
const fs = require('fs-extra');
const request = require('request');

async.eachSeries(config.boards, (board, boardCb) => {
    async.eachSeries(require('./data/' + board + '.json'), (thread, threadCb) => {
        let thread_data = require('./data/' + board + '/' + (thread + '').match(/.{1,4}/g).join('/') + '/' + thread + '.json');
        if (thread_data[thread]['op']['media'] !== null && thread_data[thread]['op']['media']['media_link'] !== null) {
            let link = thread_data[thread]['op']['media']['media_link'];
            let filename = link.split('/')[link.split('/').length-1];
            request(link, {encoding: 'binary'}, function(error, response, body) {
                console.log("Writing file "+ './data/' + board + '/image/' + filename.substring(0, 4) + '/' + filename.substring(4, 6) + '/' + filename);
                fs.outputFile('./data/' + board + '/image/' + filename.substring(0, 4) + '/' + filename.substring(4, 6) + '/' + filename, body, 'binary', function (err) {});
            });
        }
        for (var i in thread_data[thread]['posts']) {
            if (thread_data[thread]['posts'][i]['media'] !== null && thread_data[thread]['posts'][i]['media']['media_link'] !== null) {
                let link = thread_data[thread]['posts'][i]['media']['media_link'];
                let filename = link.split('/')[link.split('/').length-1];
                request(link, {encoding: 'binary'}, function(error, response, body) {
                    console.log("Writing file "+ './data/' + board + '/image/' + filename.substring(0, 4) + '/' + filename.substring(4, 6) + '/' + filename);
                    fs.outputFile('./data/' + board + '/image/' + filename.substring(0, 4) + '/' + filename.substring(4, 6) + '/' + filename, body, 'binary', function (err) {});
                });
            }
        }
        threadCb();
    }, (err) => {
        boardCb(err);
    });
});
