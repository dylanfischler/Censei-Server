'use strict';

const VERSION = 'V1';

const express = require('express');
const bodyParser = require('body-parser');

const clarifaiLib = require('../lib/Clarifai/clarifai');
const watsonLib = require('../lib/Watson/watson');

const verification = require('../lib/verification');

const configure = (app) => {
  // check for required env
  if(!(process.env.CLARIFAI_CLIENT_ID 
    && process.env.CLARIFAI_CLIENT_SECRET)) {
    console.error("Please provide Clarifai credentials (see README).");
    process.exit(0);
  }
  else if(!(process.env.SERVICE_NAME_USERNAME 
    && process.env.SERVICE_NAME_PASSWORD)) {
    console.error("Please provide Watson credentials (see README).");
    process.exit(0);
  }

  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
  app.use(bodyParser.json({limit: '50mb'}))

  let clarifai = clarifaiLib({
    clientId: process.env.CLARIFAI_CLIENT_ID,
    clientSecret: process.env.CLARIFAI_CLIENT_SECRET
  });

  let watson = watsonLib({
    username: process.env.SERVICE_NAME_USERNAME,
    password: process.env.SERVICE_NAME_PASSWORD
  });

  app.post(`/api/${VERSION}/clarifai/predictImage`, (req, res) => {
    // console.log('has a body? ', (req.body.file));
    // console.log("processing image...", req.body.file);
    clarifai.predictImage({ image: req.body.file }).then(
      (response) => {
        // console.log("RESPONSE", JSON.stringify(response));
        // res.status(200).send(response);
      }).catch((err) => {
        console.log("ERROR", err);
        // console.error(err);
        // res.status(500).send(err)
    });
  });

  app.post(`/api/${VERSION}/verify`, (req, res) => {
    let errors = {}, results = {};

    var checkResults = () => {
      if(errors.clarifai || errors.watson) {
        res.send(errors);
      }
      else if(results.clarifai && results.watson) {
        // console.log("haz resultz", results);
        verification.isValid(results);
      }
    }


    clarifai.predictImage({ image: req.body.file }).then(
      (response) => {
        console.log("clarifai:got a response");
        results.clarifai = response;
        checkResults();
      },
      (error) => {
        console.log("clarifai: error");
        errors.clarifai = error;
        checkResults();
      });

    watson.analyze({ text: req.body.text || "" }).then(
      (response) => {
        // results.watson = response;
        console.log("watson:got a response");
        results.watson = response;
        checkResults();
      },
      (error) => {
        console.log("watson:got a response");
        errors.watson = error;
        checkResults();
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