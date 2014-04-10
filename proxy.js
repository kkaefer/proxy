var path = require('path');
var express = require('express');
var request = require('request');
var fs = require('fs');
var http = require('http');
var https = require('https');
var url = require('url');


var app = express();

app.use(function(req, res, next) {
    var cacheKey = new Buffer(req.url).toString('base64').replace(/\//g, '-');
    var folder = path.join('cache', req.protocol + '_' + req.headers.host);
    req.cache = {
        uri: req.protocol + '://' + req.headers.host + req.url,
        file: path.join(folder, cacheKey + '.json'),
        content: path.join(folder, cacheKey),
    }

    console.warn(req.cache.uri);

    fs.mkdir(folder, function(err) {
        fs.readFile(req.cache.file, function(err, file) {
            if (err) return next();

            var cache = JSON.parse(file);
            fs.readFile(req.cache.content, function(err, data) {
                if (err) return next();

                for (var key in cache.headers) {
                    res.setHeader(key, cache.headers[key]);
                }
                res.send(cache.status, data);
            });
        });

    });
});

app.use(function(req, res, next) {
    request({
        url: req.cache.uri,
        followRedirect: false,
        encoding: null
    }, function(err, response, data) {
        if (err) return next(err);

        var cache = {
            status: response.statusCode,
            length: data.length,
            headers: response.headers
        };
        fs.writeFile(req.cache.file, JSON.stringify(cache), function(err) {
            if (err) return next(err);

            fs.writeFile(req.cache.content, data || '', function(err) {
                if (err) return next(err);

                for (var key in cache.headers) {
                    res.setHeader(key, cache.headers[key]);
                }
                res.send(cache.status, data);
            });

        });

    });
});


var options = {
    key: fs.readFileSync('./keys/private.key'),
    cert: fs.readFileSync('./keys/public.cer')
};

try { fs.mkdirSync('cache'); } catch(err) {}

http.createServer(app).listen(80);
https.createServer(options, app).listen(443);
