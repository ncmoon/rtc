/* jshint esversion:8 */
/**************************************************************************
  server.js
  =========

  

  (c)2017-22 Nick Moon
***************************************************************************/
import process from 'process';
import http from 'http';
import url from 'url';
import fs from 'fs';
import mime from 'mime-types';
/*
const
  process = require('process'),
  http = require('http'),
  //path = require('path'),
  url = require('url'),
  fs = require('fs'),
  mime = require('mime-types');
*/  
var
  port = parseInt(process.argv[2], 10) || 80; 

var Server = function() {

  function respond(req, resp, name, statusCode, mimeType, data) {
    resp.writeHeader(statusCode, {"Content-Type": mimeType});
    if (statusCode == 200) { resp.write(data); }
    resp.end();
    console.log(name + ' ' + req.url + ' ' + req.method + ' ' + statusCode + ' ' + mimeType + ' ' + (data ? data.length : '-') + '[' + req.connection.remoteAddress + ']');
  }
  
  function getFile(req, resp, name, pathName) {
    var mimeType = mime.lookup(pathName);
    fs.readFile(pathName, {encoding: mime.charset(mimeType)}, function(err, data) {
        respond(req, resp, name, err ? 404 : 200, err ? 'text/html' : mimeType, data);
      });
  } //getFile

  function dirAsHTML(pathName, files) {
    var result = '<html><head><title>' + pathName + '</title></head><body><h1>' + pathName + '</h1><ul>';
    result += '<li><a href="../">..</a></li>';
    if (Array.isArray(files)) {
      files.forEach(function(item) {
          if (fs.statSync(pathName + item).isDirectory()) {
            result += '<li><a href="' + item + '/">' + item + '/<a></li>';
          }
          else {
            result += '<li><a href="' + item + '">' + item + '<a></li>';
          }  
        });
    }  
    result += '</ul></body></html>';
    return result;
  } //dirAsHTML
  
  function webRequest(req, resp) {
    try {
      var u = url.parse(req.url, true);  //TODO use this ?
      var pathname = '.' + req.url;
      if (req.connection.remoteAddress == '127.0.0.1' || req.connection.remoteAddress == '::1' ||
        req.connection.remoteAddress == '0:0:0:0:0:0:0:1' || req.connection.remoteAddress == '::ffff:127.0.0.1') {
        if (pathname.slice(-1) == '/') {  // isDir
          pathname += 'index.html';
          //console.log(pathname);
          if (fs.existsSync(pathname)) {
            console.log('index.html exists');
            getFile(req, resp, 'HTTP', pathname);
          }
          else {
            console.log('directory listing');
            //return directory listing
            fs.readdir(pathname, function (err, files) {
              respond(req, resp, 'HTTP' + req.httpVersion, err ? 404 : 200, 'text/html', dirAsHTML(pathname, files));
            });
          }
        }
        else {
          if (fs.existsSync(pathname)) {
            //console.log('not index', pathname);
            getFile(req, resp, 'HTTP', pathname);
          }
          else {
            respond(req, resp, 'HTTP' + req.httpVersion, 404, 'text/html', '');
          }
        }
      }
      else {
        respond(req, resp, 'HTTP' + req.httpVersion, 403, 'text/html', 'Forbidden');
      }
    }
    catch (e) {
      console.log(e);
    }
  } //webRequest

  function lambdaRequest(req, resp) {
    var u = url.parse(req.url, true);  
    //console.log('lambdaRequest()', process.cwd(), u.pathname);

    function handler(pathName, cb) {
      var 
        err = false, 
        data,
        lambda,
        context = {
          functionName: pathName,
          functionVersion: 0
        },
        event = {
          queryStringParameters: {},
          httpMethod: "GET",
          body: ""
        };
      if (require.cache[pathName.replace(/\//gi,'\\')]){
        delete require.cache[pathName.replace(/\//gi,'\\')];
      }      
      lambda = require(pathName);
      Object.keys(u.query).forEach(function(key) {
          event.queryStringParameters[key] = u.query[key];
        });
      lambda.handler(event, context, function(err, data) {
          cb(err, data);
        });
    } //handler

    if (u.pathname == '/favicon.ico') {
      respond(req, resp, 'LAMBDA', 404, 'text/html', 'Not found');
    }
    else {
      handler(process.cwd() + u.pathname, function(err, data) {
          //console.log('lambdaRequest() cb', err, data);
          respond(req, resp, 'LAMBDA', err ? 502 : 200, err ? 'text/html' : 'application/json', JSON.stringify(data, null, 2));
        });
    }  
  } //lambdaRequest

  return {
    webRequest: webRequest,
    lambdaRequest: lambdaRequest

  };
}(); //Server

http.createServer(Server.webRequest).listen(port);
console.log('Web server started on: ' + port);
//http.createServer(Server.lambdaRequest).listen(config.lambda.port || 88);
//console.log('Lambda server started on: ' + config.lambda.port);
