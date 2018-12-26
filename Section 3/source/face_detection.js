class FaceDetector {
  async detect_faces(ed) {
    msg('Loading face detector...')

    // Here we're loading models for face detection
    // Face API gives you a lot of different models to try,
    // here we're using just some default one available.
    this.options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 });
    await faceapi.loadSsdMobilenetv1Model('/models/face');
    await faceapi.loadFaceLandmarkModel('models/face/')
    await faceapi.loadFaceRecognitionModel('models/face/');

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    msg('Looking for faces in the photo...');
    var fullFaceDescriptions = await faceapi.detectAllFaces(canvas, this.options).withFaceLandmarks().withFaceDescriptors()

    const detectionsArray = fullFaceDescriptions.map(fd => fd.detection)

    const faces = await faceapi.extractFaces(canvas, detectionsArray);

    // For each detected face detect emotion.
    let emotions = await Promise.all(
      faces.map(async face => await ed.classify(face))
    )

    // Here we're just doing the emotion analysis for the first detected
    // face.
    show_emotions(emotions[0]);

    // Find the most probablw emotion.
    var key_emotions=[];
    for(var i=0;i<emotions.length;++i) {
      var max_prob=0.0;
      var max_label='';
      for(var j=0;j<emotions[i].length;++j) {
        if(emotions[i][j].value > max_prob) {
          max_prob=emotions[i][j].value;
          max_label=emotions[i][j].label['name'];
        }
      }
      // Get the detection rectangle
      // put a emotion text there.
      var da=detectionsArray[i]
      var box=da.box;
      var x=box['x'];
      var y=box['y'];
      var width=box['width'];
      var height=box['height'];
      var ann=new faceapi.BoxWithText(new faceapi.Rect(x, y, width, height), max_label);
      key_emotions.push(ann);
    }
    // Draw our new detection
    var context = canvas.getContext('2d');
    faceapi.drawDetection(canvas, key_emotions, { withScore: false });

  }
};
