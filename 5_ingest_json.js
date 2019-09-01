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

async.eachSeries(config.boards, (board, boardCb) => {
        let sql = "INSERT INTO " + board + " (num,subnum,thread_num,op,timestamp,timestamp_expired," +
            "preview_orig,preview_w,preview_h,media_filename,media_w,media_h,media_size," +
            "media_hash,media_orig,spoiler,deleted,capcode,email,name,trip,title,comment,sticky,locked,poster_hash," +
            "poster_country,exif) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    require('./data/' + board + '.json').forEach(function (thread) {
    let thread_data = require('./data/' + board + '/' + (thread + '').match(/.{1,4}/g).join('/') + '/' + thread + '.json');
    con.query(sql, [thread_data[thread]['op']['num'],
            thread_data[thread]['op']['subnum'],
            thread_data[thread]['op']['thread_num'],
            thread_data[thread]['op']['op'],
            thread_data[thread]['op']['timestamp'] - 14400,
            thread_data[thread]['op']['timestamp_expired'],
            (thread_data[thread]['op']['media'] ? thread_data[thread]['op']['media']['preview_orig'] : null),
            (thread_data[thread]['op']['media'] ? thread_data[thread]['op']['media']['preview_w'] : 0),
            (thread_data[thread]['op']['media'] ? thread_data[thread]['op']['media']['preview_h'] : 0),
            (thread_data[thread]['op']['media'] ? thread_data[thread]['op']['media']['media_filename'] : null),
            (thread_data[thread]['op']['media'] ? thread_data[thread]['op']['media']['media_w'] : 0),
            (thread_data[thread]['op']['media'] ? thread_data[thread]['op']['media']['media_h'] : 0),
            (thread_data[thread]['op']['media'] ? thread_data[thread]['op']['media']['media_size'] : 0),
            (thread_data[thread]['op']['media'] ? thread_data[thread]['op']['media']['media_hash'] : null),
            (thread_data[thread]['op']['media'] ? thread_data[thread]['op']['media']['media_orig'] : null),
            (thread_data[thread]['op']['media'] ? thread_data[thread]['op']['media']['spoiler'] : 0),
            thread_data[thread]['op']['deleted'],
            thread_data[thread]['op']['capcode'],
            thread_data[thread]['op']['email'],
            thread_data[thread]['op']['name'],
            thread_data[thread]['op']['trip'],
            thread_data[thread]['op']['title'],
            thread_data[thread]['op']['comment'],
            thread_data[thread]['op']['sticky'],
            thread_data[thread]['op']['locked'],
            thread_data[thread]['op']['poster_hash'],
            thread_data[thread]['op']['poster_country'],
            (thread_data[thread]['op']['media'] ? thread_data[thread]['op']['media']['exif'] : null)],
        function (err, result) {
            if (err) {
                if (err.code == "ER_DUP_ENTRY") {
                    console.log("/" + board + "/ post No." + thread_data[thread]['op']['num'] + "," + thread_data[thread]['op']['subnum'] + " already exists");
                } else {
                    throw err;
                }
            }
            if (result) {
                console.log("inserted /" + board + "/ post No." + thread_data[thread]['op']['num'] + "," + thread_data[thread]['op']['subnum']);
            }
        });

    for (var i in thread_data[thread]['posts']) {
        let icopy = i;
        con.query(sql, [thread_data[thread]['posts'][icopy]['num'],
                thread_data[thread]['posts'][icopy]['subnum'],
                thread_data[thread]['posts'][icopy]['thread_num'],
                thread_data[thread]['posts'][icopy]['op'],
                thread_data[thread]['posts'][icopy]['timestamp'] - 14400,
                thread_data[thread]['posts'][icopy]['timestamp_expired'],
                (thread_data[thread]['posts'][icopy]['media'] ? thread_data[thread]['posts'][icopy]['media']['preview_orig'] : null),
                (thread_data[thread]['posts'][icopy]['media'] ? thread_data[thread]['posts'][icopy]['media']['preview_w'] : 0),
                (thread_data[thread]['posts'][icopy]['media'] ? thread_data[thread]['posts'][icopy]['media']['preview_h'] : 0),
                (thread_data[thread]['posts'][icopy]['media'] ? thread_data[thread]['posts'][icopy]['media']['media_filename'] : null),
                (thread_data[thread]['posts'][icopy]['media'] ? thread_data[thread]['posts'][icopy]['media']['media_w'] : 0),
                (thread_data[thread]['posts'][icopy]['media'] ? thread_data[thread]['posts'][icopy]['media']['media_h'] : 0),
                (thread_data[thread]['posts'][icopy]['media'] ? thread_data[thread]['posts'][icopy]['media']['media_size'] : 0),
                (thread_data[thread]['posts'][icopy]['media'] ? thread_data[thread]['posts'][icopy]['media']['media_hash'] : null),
                (thread_data[thread]['posts'][icopy]['media'] ? thread_data[thread]['posts'][icopy]['media']['media_orig'] : null),
                (thread_data[thread]['posts'][icopy]['media'] ? thread_data[thread]['posts'][icopy]['media']['spoiler'] : 0),
                thread_data[thread]['posts'][icopy]['deleted'],
                thread_data[thread]['posts'][icopy]['capcode'],
                thread_data[thread]['posts'][icopy]['email'],
                thread_data[thread]['posts'][icopy]['name'],
                thread_data[thread]['posts'][icopy]['trip'],
                thread_data[thread]['posts'][icopy]['title'],
                thread_data[thread]['posts'][icopy]['comment'],
                thread_data[thread]['posts'][icopy]['sticky'],
                thread_data[thread]['posts'][icopy]['locked'],
                thread_data[thread]['posts'][icopy]['poster_hash'],
                thread_data[thread]['posts'][icopy]['poster_country'],
                (thread_data[thread]['posts'][icopy]['media'] ? thread_data[thread]['posts'][icopy]['exif'] : null)],
            function (err, result) {
                if (err) {
                    if (err.code == "ER_DUP_ENTRY") {
                        console.log("/" + board + "/ post No." + thread_data[thread]['posts'][icopy]['num'] + "," + thread_data[thread]['posts'][icopy]['subnum'] + " already exists");
                    } else {
                        throw err;
                    }
                }
                if (result) {
                    console.log("inserted /" + board + "/ post No." + thread_data[thread]['posts'][icopy]['num'] + "," + thread_data[thread]['posts'][icopy]['subnum']);
                }
            });
    }
});
con.end(function (err) {
    console.log("closed connection to " + config.mysql.database);
});
});

