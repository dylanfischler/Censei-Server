'use strict';

const VERSION = 'V1';

const express = require('express');
const bodyParser = require('body-parser');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });

// const busboy = require('connect-busboy');


const clarifaiLib = require('../lib/Clarifai/clarifai');
const watsonLib = require('../lib/Watson/watson');

const configure = (app) => {
  // check for required env
  if(!(process.env.CLARIFAI_CLIENT_ID && process.env.CLARIFAI_CLIENT_SECRET)) {
    console.error("Please provide Clarifai credentials (see README).");
    process.exit(0);
  }

  let clarifai = clarifaiLib({
    clientId: process.env.CLARIFAI_CLIENT_ID,
    clientSecret: process.env.CLARIFAI_CLIENT_SECRET
  });

  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
  app.use(bodyParser.json({limit: '50mb'}))

  // let watson = watsonLib({
  //   username: process.env.SERVICE_NAME_USERNAME,
  //   password: process.env.SERVICE_NAME_PASSWORD
  // });

  app.post(`/api/${VERSION}/clarifai/predictImage`, (req, res) => {
    // console.log('has a body? ', (req.body.file));
    // console.log("processing image...", req.body.file);
    clarifai.predictImage({ image: req.body.file }).then(
      (response) => {
        console.log("RESPONSE", JSON.stringify(response));
        // res.status(200).send(response);
      }).catch((err) => {
        console.log("ERROR", err);
        // console.error(err);
        // res.status(500).send(err)
    });
  });

  
  
  app.get('/api/', (req, res) => {
    res.send("hello world");
  });

  app.post(`/api/${VERSION}/clarifai/predictURL`, (req, res) => {
    if(!req.body.url) return res.status(400).send('Missing URL parameter');
    clarifai.predictURL({ url: req.body.url }).then(
      (response) => {
        res.status(200).send(response);
      }).catch((err) => {
        console.error(err);
        res.status(500).send(err)
    });
  });

  return app;
}

module.exports = () => {
  let app = express();
  return configure(app);
};