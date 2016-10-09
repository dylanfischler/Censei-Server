'use strict';

const express = require('express');
const busboy = require('connect-busboy');
const request = require('request');
const concat = require('concat-stream');
const censeiClient = require('censei-client');
const ejs = require('ejs');

let app = express();

app.use(busboy());
app.set('view engine', 'ejs');

const censei = censeiClient({ server_path: 'http://localhost:8080'});

app.get('/test', (req, res) => res.sendFile(__dirname + '/test.html'));

app.post('/uploadImage', (req, res) => {
  let fullFileBuffer, text;

  var processUpload = () => {
    censei.isThisSafe({ 
      image: fullFileBuffer, 
      text: text 
    }).then(
      (result) => {
        console.log("result", result);
        // res.status(200).send(result);
        res.render(__dirname + '/views/status', { result: result });
      },
      (error) => {
        console.log("error", error);
        res.status(500).send(error);
      }
    )
  };

  req.pipe(req.busboy);
  
  // get fields
  req.busboy.on('field', (fieldname, val) => {
    if(fieldname === "text") text = val;
  });

  // get files
  req.busboy.on('file', (fieldName, fileStream, fileName, encoding, mimeType) => {
    fileStream.pipe(concat((fileBuffer) => {
      fullFileBuffer = fileBuffer;
    }))
  });

  req.busboy.on('finish', () => processUpload());

});


app.listen(9999, () => {
  console.log(`Test server listening on port 9999`);
});