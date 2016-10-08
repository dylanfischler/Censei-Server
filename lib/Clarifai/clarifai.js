'use strict';

const Clarifai = require('clarifai');

let app,
  fn = {};

fn.predictURL = ({ url, model = Clarifai.NSFW_MODEL }) => {
  return new Promise((resolve, reject) => {
    app.models.predict(model, url).then(
      (response) => resolve(response.data)
    ).catch((err) => reject(err));
  });
}

fn.predictImage = ({ image, model = Clarifai.NSFW_MODEL }) => {
  return new Promise((resolve, reject) => {
    app.models.predict(model, { base64: image });
  });
};

module.exports = ({ clientId, clientSecret }) => {
  app = new Clarifai.App(clientId, clientSecret);
  console.log("Instantiated Clarifai Application");

  return fn;
};