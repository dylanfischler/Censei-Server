'use strict';

const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

let toneAnalyzer,
  fn = {};

fn.analyze = ({ text }) => {
  return new Promise((resolve, reject) => {
    toneAnalyzer.tone({ text }, (err, tone) => {
      if (err) {
        reject(err);
      } else {
        // console.log(JSON.stringify(tone, null, 2));
        resolve(tone);
      }
    })
  });
}

module.exports = ({ username, password }) => {
  toneAnalyzer = new ToneAnalyzerV3({
	  username: username,
	  password: password,
	  version_date: '2016-05-19'
	});
  console.log("Instantiated Watson API");

  return fn;
};