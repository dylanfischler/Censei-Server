'use strict';

const express = require('express');
const busboy = require('connect-busboy');
const request = require('request');
const concat = require('concat-stream');

let app = express();

app.use(busboy());

app.post('/uploadImage', (req, res) => {
  // console.log("files", req.files);
  // res.send(req.files);
  var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldName, fileStream, fileName, encoding, mimeType) {
    fileStream.pipe(concat(function (fileBuffer) {
      console.log('done?', fileBuffer);
      request.post({
        url: 'http://localhost:8080/api/V1/clarifai/predictImage',
        formData: {
          file: fileBuffer
        }
      }, function (err, r, body) {
        // Do rendering stuff, handle callback
      })
    }))
  })

  /*
  req.busboy.on('file', function (fieldname, file, filename) {
      // file.pipe(request.post('http://localhost:8080/api/V1/clarifai/predictImage'));
      file.pipe(fs.createWriteStream(saveTo));

      file.on('data', function(data) {
        console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
        // file.pipe(request.post('http://localhost:8080/api/V1/clarifai/predictImage'));
      });
      file.on('end', function() {
        console.log('File [' + fieldname + '] Finished');
        file.toString();
      });

      // fstream = fs.createWriteStream(__dirname + '/files/' + filename);
      // file.pipe(fstream);
      // fstream.on('close', function () {
      //     res.redirect('back');
      // });
  });
  */
});


app.listen(9999, () => {
  console.log(`Test server listening on port 9999`);
});