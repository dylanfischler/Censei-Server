'use strict';

const express = require('express');
const busboy = require('connect-busboy');
const request = require('request');
const concat = require('concat-stream');
const censeiClient = require('censei-client');

let app = express();

app.use(busboy());

const censei = censeiClient({ server_path: 'http://localhost:8080'});

app.post('/uploadImage', (req, res) => {
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldName, fileStream, fileName, encoding, mimeType) {
    fileStream.pipe(concat(function (fileBuffer) {
      censei.isThisSafe({ image: fileBuffer, text: "" });

      // request.post({
      //   url: 'http://localhost:8080/api/V1/clarifai/predictImage'
      // }, function (err, r, body) {
      //   // do handling here
      //   res.send("Done!");
      // }).form({file: fileBuffer.toString('base64')})
    }))
  });
});


app.listen(9999, () => {
  console.log(`Test server listening on port 9999`);
});