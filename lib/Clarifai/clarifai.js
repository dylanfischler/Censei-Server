const Clarifai = require('clarifai');

let app,
  fn = {};

fn.predictURL = ({ url, model = Clarifai.GENERAL_MODEL }) => {
  return new Promise((resolve, reject) => {
    app.models.predict(model, url).then(
      (response) => resolve(response),
      (err) => reject(err)
    );
  });
}

module.exports = ({ clientId, clientSecret }) => {
  app = new Clarifai.App(clientId, clientSecret);
  console.log("Instantiated Clarifai Application");
};