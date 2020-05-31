var express = require('express');
var path = require('path');
var app = express();

// Define the port to run on
app.set('port', 8080);

app.use(express.static(__dirname));
app.get('/', (req, res) =>
  res.send(`
  <div id="theater">
    <video id="video" src="/Big_Buck_Bunny_small.ogv" controls="false"></video>
    <canvas id="canvas"></canvas>
    <canvas id="canvasNoShader"></canvas>
    <label>
      <br />Try to play me :)</label>
    <br />
  </div>
  <script src="/sobel.js"></script>
  <script>
    // main process
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var canvasNoShader = document.getElementById('canvasNoShader');
    var ctxNoShader = canvasNoShader.getContext('2d');
    var video = document.getElementById('video');

    // set canvas size = video size when known
    // set canvasNoShader size = video size when known
    video.addEventListener('loadedmetadata', function() {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvasNoShader.width = video.videoWidth;
      canvasNoShader.height = video.videoHeight;
    });

    video.addEventListener('play', function() {
      var $this = this; //cache
      (function loop() {
        if (!$this.paused && !$this.ended) {
          // default image
          ctx.drawImage($this, 0, 0);

          // clear shader image
          // Sobel constructor returns an Uint8ClampedArray with sobel data
          var sobelData = Sobel($this);
        
          // [sobelData].toImageData() returns a new ImageData object
          var sobelImageData = sobelData.toImageData();
          ctxNoShader.putImageData(sobelImageData, 0, 0);
          setTimeout(loop, 1000 / 30); // drawing at 30fps
        }
      })();
    }, 0);
  </script>`))
// Listen for requests
var server = app.listen(app.get('port'), function () {
  var port = server.address().port;
  console.log('Server starts on port ' + port);
});