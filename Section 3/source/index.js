function msg(m) {
  // Wirte a m message into our message div.
  document.getElementById('msg').innerHTML=m;
}

async function load_canvas(url) {
  msg('Loading image...');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');


  const image = new Image(1, 1); // Using optional size for image
  image.onload = drawImageActualSize; // Draw when image has loaded

  image.src=url;
  async function drawImageActualSize() {
    const padding_for_text=50;
    // Use the intrinsic size of image in CSS pixels for the canvas element
    canvas.width = this.naturalWidth+padding_for_text;
    canvas.height = this.naturalHeight+padding_for_text;
    ctx.drawImage(this, 0, 0);
  }
};

function clean_emotions() {
  // Remove the informations about detected emotions
  var de=document.getElementById('detected_emotions');

  while (de.hasChildNodes()) {
      de.removeChild(de.firstChild);
  }
};

function show_emotions(emotions) {
  // Create a table with emotions that has
  // been detected or return false if there was
  // no faces detected.
  var de=document.getElementById('detected_emotions');
  if(!emotions) {
    msg('No faces detected.');
    return false;
  }

  // Create a row with the name of detected emotion
  // and the probablity that it was detected.
  for(var i=0;i<emotions.length;++i) {
    var row = de.insertRow(0);
    var emotion = row.insertCell(0);
    var prob = row.insertCell(1);

    emotion.innerHTML = emotions[i].label['name'];
    prob.innerHTML = 100*emotions[i].value.toFixed(2) + '%';
  }
  msg('');
};

function main() {
  // This is our main entry point function.

  // First we're initializing our detectors
  var fd=new FaceDetector();

  var ed=new EmotionDetector();
  msg('Loading emotion detector...')
  ed.load().then(function() { msg('') });

  function detect(e){
    // Load an image from a link's url
    // into the canvas.
    // We're using canvas since we want to
    // draw a rectangle with detected face
    // and the name of most probable emotion
    // detected.
    e.preventDefault();
    var url=e.target.href;

    var lc=load_canvas(url);
    // Clean up the info about detected emotions.
    clean_emotions();
    // We're starting by detecing faces and
    // then running an emotion detector on
    // detected faces (that's why we're passing the emotion detector)
    // here.
    var df=fd.detect_faces(ed);

    // Run the face detection once our canvas is ready.
    lc.then(df);
  };

  // Then we're defining a series of steps to detect
  // emotions when clicking on each photo link.
  var image_urls=document.getElementsByClassName("load_url");

  for (var i = 0; i < image_urls.length; i++) {
      image_urls[i].addEventListener('click', detect, false);
  }

}
