class AudioAnalyser {
  // Our main class for doing Sentiment analysis.

  async init(urls, maxLen=130) {
    // Load both pre-trained model and its metadata.
    // urls - an object/dictonary with model/metadata
    //        keys that points out to URLS for hosted resources.
    this.urls = urls;
    this.maxLen=maxLen;
    this.model = await this.load_model(urls.model);
    return this;
  }

  async load_model(url) {
    // Load a pre-trained model from a specific URL.
    try {
      var model = await tf.loadModel(url);
      return model;
    } catch (err) {
      console.error(err);
    }
  }

  predict(audio_features) {
    const audio_buffer =new Float32Array(this.maxLen);

    for (let i = 0; i < this.maxLen; ++i) {
       var v=0.0;
       if(i<audio_features.length) {
         v=audio_features[i];
       }
       audio_buffer.set([v], i);
    }
    // Turn our buffer into a special
    // tensorflow array called tensor.
    console.log('Audio features', audio_features);
    const xs = tf.tensor1d(audio_buffer, 'float32').reshape([1, this.maxLen, 1]);
    xs.print();
    // Do the analysis.
    var output = this.model.predict(xs);
    // Since the results is tensor as well,
    // let's get the actual value of probablity of text
    // being positive. Here we're using synchronous/blocking
    // method to get data immediately.
    // With more data you would probably need to use
    // data() and handle its asynchronous nature.
    var score = output.dataSync();
    // Remove tensor from the memory.
    output.dispose();
    return score;
  }
};

async function setup_analyser(urls) {
  // Just create a new analyser with specific
  // available model/metadata URL.
  var analyser = await new AudioAnalyser().init(urls);
  return analyser;
}

var CNN_URLS = {
  model: '/models/speech_emotions_detection_model.json',
};
