'use strict';

const express = require('express');
const busboy = require('connect-busboy');
const request = require('request');
const concat = require('concat-stream');

let app = express();

app.use(busboy());

app.post('/uploadImage', (req, res) => {
  var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldName, fileStream, fileName, encoding, mimeType) {
    fileStream.pipe(concat(function (fileBuffer) {
      request.post({
        url: 'http://localhost:8080/api/V1/clarifai/predictImage'
      }, function (err, r, body) {
        // do handling here
        res.send("Done!");
      }).form({file: fileBuffer.toString()})
    }))
  });
});


app.listen(9999, () => {
  console.log(`Test server listening on port 9999`);
});