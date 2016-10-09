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
  // console.log('trying to process image with clarifai');
  // console.log(image);
  
  return new Promise((resolve, reject) => {
    app.models.predict(model, { base64: image }).then(
      (response) => {
        // console.log("response from predictImage", response.data);
        resolve(response.data)
      },
      (error) => {
        reject(error)
      }
    )
  });
};

module.exports = ({ clientId, clientSecret }) => {
  app = new Clarifai.App(clientId, clientSecret);
  console.log("Instantiated Clarifai Application");

  return fn;
};