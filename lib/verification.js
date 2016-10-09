let verif = {};

verif.constants = {};
verif.constants.NSFW = 0.6;

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
  console.log("tone", JSON.stringify(tone));
};

verif.isValid = (results) => {
  let isNSFW = validateClarifai(results.clarifai);
  let hasIllIntent = validateWatson(results.watson);
  console.log(`isNSFW: ${isNSFW}`);
  console.log(`hasIllIntent: ${hasIllIntent}`);
};

module.exports = verif;