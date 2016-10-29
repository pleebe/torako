'use strict';

const config = require('./config.json');

const async = require('async');
const request = require('./utils.js').buildRequest({
    baseUrl: config.endpoint,
    json: true,
});

module.exports = {};

module.exports.page = function(board, page, cb) {
    return request({
        uri: '/_/api/chan/index/',
        qs: {
            board: board,
            page: page,
        },
    }, cb);
};

module.exports.thread = function(board, num, cb) {
    return request({
        uri: '/_/api/chan/thread/',
        qs: {
            board: board,
            num: num,
        },
    }, cb);
};