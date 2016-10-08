const express = require('express');
const clarifaiLib = require('../lib/Clarifai/clarifai');
const watsonLib = require('../lib/Watson/watson');

const configure = (app) => {
  if(!(process.env.CLARIFAI_CLIENT_ID && process.env.CLARIFAI_CLIENT_SECRET)) {
    console.error("Please provide Clarifai credentials (see README).");
    process.exit(0);
  }

  let clarifai = clarifaiLib({
    clientId: process.env.CLARIFAI_CLIENT_ID,
    clientSecret: process.env.CLARIFAI_CLIENT_SECRET
  });

  let watson = watsonLib({
    username: process.env.SERVICE_NAME_USERNAME,
    password: process.env.SERVICE_NAME_PASSWORD
  });

  return app;
}

module.exports = () => {
  let app = express();
  return configure(app);
};