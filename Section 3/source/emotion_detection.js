// Heavily inspired (but simplified) and based on https://github.com/brendansudol/faces

const EMOTIONS = {
  0: { name: 'Anger'},
  1: { name: 'Disgust'},
  2: { name: 'Fear'},
  3: { name: 'Happy'},
  4: { name: 'Sad'},
  5: { name: 'Surprise'},
  6: { name: 'Neutral'},
};

// start EmotionDetect
const prepImg = (img, size) => {
  // Convert to tensor
  const imgTensor = tf.fromPixels(img)

  const normalized = imgTensor.toFloat()

  if (imgTensor.shape[0] === size && imgTensor.shape[1] === size) {
    return normalized
  }
  // Resize image to proper dimensions
  return tf.image.resizeBilinear(normalized, [size, size], true)
}

const rgbToGrayscale = async imgTensor => {
  const minTensor = imgTensor.min()
  const maxTensor = imgTensor.max()
  const min = (await minTensor.data())[0]
  const max = (await maxTensor.data())[0]
  minTensor.dispose()
  maxTensor.dispose()

  // Normalize to [0, 1]
  const normalized = imgTensor.sub(tf.scalar(min)).div(tf.scalar(max - min))

  // Compute mean of R, G, and B values
  let grayscale = normalized.mean(2)

  // Expand dimensions to get proper shape: (h, w, 1)
  return grayscale.expandDims(2)
}

class EmotionDetector {
  constructor(path = '/models/emotions/model.json', imageSize = 48, classes = EMOTIONS, isGrayscale = false) {
    // Initialize detector's defaults.
    this.path = path
    this.imageSize = imageSize
    this.classes = classes
    this.isGrayscale = isGrayscale
  }

  async load() {
    msg('Loading emotion detector...');
    this.model = await tf.loadModel(this.path);
    msg('');
  }

  async imgToInputs(img) {
    // Convert to tensor and resize if necessary
    let norm = await prepImg(img, this.imageSize)

    if (!this.isGrayscale) {
      norm = await rgbToGrayscale(norm)
    }

    // Reshape to a single-element batch so we can pass it to predict.
    return norm.reshape([1, ...norm.shape])
  }

  async classify(img, topK = 10) {
    msg('Hmm looking for emotions...');
    const inputs = await this.imgToInputs(img)
    const logits = this.model.predict(inputs)
    const classes = await this.getTopKClasses(logits, topK)
    return classes
  }

  async getTopKClasses(logits, topK = 10) {
    const values = await logits.data()
    let predictionList = []

    for (let i = 0; i < values.length; i++) {
      predictionList.push({ value: values[i], index: i })
    }

    predictionList = predictionList
      .sort((a, b) => b.value - a.value)
      .slice(0, topK)

    return predictionList.map(x => {
      return { label: this.classes[x.index], value: x.value }
    })
  }
}
