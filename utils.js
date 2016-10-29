'use strict';

const config = require('./config.json');

const async = require('async');
const request = require('request').defaults({
    gzip: true,
    headers: { 
        'contact-us-at': '#bibanon @ irc.rizon.net' 
    },
    method: 'GET',
    rejectUnauthorized: false,
});

/*module.exports = { 
    buildRequest: function(opts) {
        let r = request;
        if (typeof opts === 'object')
            r = request.defaults(opts);
        return function(opts) {
            return new Promise((resolve, reject) => {
                r(opts, (err, res, body) => {
                    if (err !== null)
                        reject(err);
                    else
                        resolve(body);
                });
            });
        };
    }
};*/

/*module.exports = { 
    buildRequest: function(opts) {
        let r = request;
        if (typeof opts === 'object')
            r = request.defaults(opts);
        return function(opts2) {
            return new Promise((resolve, reject) => {
                async.retry({
                    times: config.error.retries,
                    interval: config.error.wait
                }, (retryCb) => {
                    r(opts2, (err, res, data) => {
                        if (err !== null)
                            retryCb(err, null);
                        else
                            retryCb(null, data);
                    });
                }, (err, data) => {
                    if (err !== null)
                        reject(err);
                    else
                        resolve(data);
                });
            });
        };
    }
};*/

module.exports = { 
    buildRequest: function(opts) {
        let r = request;
        if (typeof opts === 'object')
            r = request.defaults(opts);
        
        return function(opts2, cb) {
            setTimeout(() => async.retry({
                times: config.error.retries,
                interval: config.error.wait
            }, (retryCb) => {
                console.log('Trying...');
                r(opts2, (err, res, data) => {
                    if (err !== null)
                        retryCb(err, null);
                    else
                        retryCb(null, data);
                });
            }, (err, data) => {
                if (err !== null)
                    cb(err, null);
                else
                    cb(null, data);
            }), config.ratelimit);
        };
    },
};