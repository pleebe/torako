'use strict';

const api = require('./api.js');
const config = require('./config.json');

const async = require('async');
const fs = require('fs-extra');
const request = require('request');
const mysql = require('mysql');

const con = mysql.createConnection({
    host: config.mysql.host,
    database: config.mysql.database,
    user: config.mysql.username,
    password: config.mysql.password
});
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to " + config.mysql.database);
});

const destination = config.file_destination;

async.eachSeries(config.boards, (board, boardCb) => {
    async.eachSeries(require('./data/' + board + '.json'), (thread, threadCb) => {
    let thread_data = require('./data/' + board + '/' + (thread + '').match(/.{1,4}/g).join('/') + '/' + thread + '.json');
if (thread_data[thread]['op']['media'] !== null && thread_data[thread]['op']['media']['media_hash'] !== null) {
    let link = thread_data[thread]['op']['media']['media_link'];
    let filename = link.split('/')[link.split('/').length - 1];
    let media_hash = thread_data[thread]['op']['media']['media_hash'];
    con.query("SELECT media FROM " + board + "_images where media_hash=?", [media_hash],
        function (err, result, fields) {
            if (err) throw err;
            let media = result[0].media;
            let source = './data/' + board + '/image/' + filename.substring(0, 4) + '/' + filename.substring(4, 6) + '/' + filename;
            let dest = destination + "/" + board + '/image/' + media.substring(0, 4) + '/' + media.substring(4, 6) + '/' + media;
            fs.copy(source, dest, (err) => {
                if (err) throw err;
            console.log(source + ' was copied to ' + dest);
        });

        });
}
for (var i in thread_data[thread]['posts']) {
    if (thread_data[thread]['posts'][i]['media'] !== null && thread_data[thread]['posts'][i]['media']['media_hash'] !== null) {
        let link = thread_data[thread]['posts'][i]['media']['media_link'];
        let filename = link.split('/')[link.split('/').length - 1];
        let media_hash = thread_data[thread]['posts'][i]['media']['media_hash'];
        con.query("SELECT media FROM " + board + "_images where media_hash=?", [media_hash],
            function (err, result, fields) {
                if (err) throw err;
                let media = result[0].media;
                let source = './data/' + board + '/image/' + filename.substring(0, 4) + '/' + filename.substring(4, 6) + '/' + filename;
                let dest = destination + "/" + board + '/image/' + media.substring(0, 4) + '/' + media.substring(4, 6) + '/' + media;
                fs.copy(source, dest, (err) => {
                    if (err) throw err;
                console.log(source + ' was copied to ' + dest);
            });
            });
    }
}
threadCb();
}, (err) => {
    boardCb(err);
});
con.end(function (err) {
    console.log("closed connection to " + config.mysql.database);
});
});
