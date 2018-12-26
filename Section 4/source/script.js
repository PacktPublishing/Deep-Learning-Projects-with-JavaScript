console.log('script');
const emotions=['neutral','calm','happy','sad','angry','fearful','disgust','surprised'];
var audioContext = null;
var suspended=true;
var analyzer= null;
var analyser=setup_analyser(CNN_URLS);

function setup(stream) {
  console.log('setup');
  audioContext = new AudioContext();

  const htmlAudioElement = document.getElementById("audio");
  const source = audioContext.createMediaElementSource(htmlAudioElement);
  source.connect(audioContext.destination);

  htmlAudioElement.onplay = async function() {
    var afeatures = await fetch('/cgi-bin/wav2json.py');
    analyser.then(async function(ready_analyser) {
      const aj= await afeatures.json();
      var out=ready_analyser.predict(aj);
      var x=tf.argMax(out).dataSync();
      document.getElementById("emotion").innerHTML=emotions[parseInt(x)];
      });
    };

};

window.onload = function() {
  const show = document.getElementById("show");

  show.addEventListener('click',function(e) {
    e.preventDefault();
    document.getElementById("audio").style.display='inline';
    show.style.display='none';
    setup();
  });

};
