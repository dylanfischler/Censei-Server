let verif = {};

verif.constants = {};
verif.constants.NSFW = 0.6;

verif.constants.tones = {};
verif.constants.tones.global_threshold = 0.45;
verif.constants.tones.emotional = 0.6;

var validateClarifai = (clar) => {
  let clarifOutput = clar.outputs;
  let data = clarifOutput[0].data;

  let sfw = 0, nsfw = 0;

  data.concepts.forEach((concept) => {
    if(concept.name === 'sfw') sfw = concept.value;
    else if(concept.name === 'nsfw') nsfw = concept.value;
  });

  // console.log("nsfw", nsfw);
  // console.log("sfw", sfw);

  if(nsfw >= verif.constants.NSFW) return true;
  else return false;
};

var validateWatson = (wat) => {
  let tone = wat.document_tone;

  let emotLevel = 0, anger = 0, disgust = 0, sadness = 0;

  tone.tone_categories.forEach((cat) => {
    if(cat.category_name === "Social Tone"){
      emotLevel = cat.tones.find((tone) => tone.tone_name === "Emotional Range").score;
    } else if(cat.category_name === "Emotion Tone") {
      cat.tones.forEach((tone) => {
        if(tone.tone_name === "Anger") anger = tone.score;
        if(tone.tone_name === "Disgust") disgust = tone.score;
        if(tone.tone_name === "Sadness") sadness = tone.score;
      });
    }
  });

  // console.log("emotLevel", emotLevel);
  // console.log("anger", anger);
  // console.log("disgust", disgust);
  // console.log("sadness", sadness);

  let thresh = verif.constants.tones.global_threshold;

  // check if emotional
  if(emotLevel >= verif.constants.tones.emotional) {
    if(anger >= thresh || sadness >= thresh || disgust >= thresh){
      return true;
    }
  } else return false;
};

verif.isValid = (results) => {
  let isNSFW = validateClarifai(results.clarifai);
  let hasIllIntent = validateWatson(results.watson);
  console.log(`isNSFW: ${isNSFW}`);
  console.log(`hasIllIntent: ${hasIllIntent}`);

  return {
    valid: (isNSFW && hasIllIntent)
  }
};

module.exports = verif;