/* ----------------------------------*/
/* ---SECTION 1: FLAPPY BIRD SETUP---*/
/* ----------------------------------*/

// Canvas
const canvas = document.getElementById("flappyCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext("2d");

// Create images
var bg = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();
var gameOver = new Image();

// Load images
bg.src = "./assets/bg.png";
pipeNorth.src = "./assets/down.png";
pipeSouth.src = "./assets/up.png";
gameOver.src = "./assets/game-over.png";

// Game variables
var score = 0;
var playerX = 10;
var playerY = 15;
var gap = 150;
var pipe = [];

pipe[0] = {
  x : canvas.width,
  y : 0
};



/* ----------------------------------*/
/* -------SECTION 2: AI SETUP--------*/
/* ----------------------------------*/
const nose = document.getElementById("nose");
const player = document.getElementById("player");

const video = document.getElementById("video");
video.width = window.innerWidth;
video.height = window.innerHeight;

console.log("Hello");

// 🤔  This section just requests camera access. No need to change. 
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
    video.srcObject = stream;
    video.play();
    return new Promise(resolve => {
      video.onloadedmetadata = () => {
        resolve(video);
      };
    });
  });
}

function detectPoseInRealTime(video, net) {
  async function poseDetectionFrame() {
    const pose = await net.estimateSinglePose(video, {
      flipHorizontal: false
    });
    
    const nosePosition = pose.keypoints[0].position;
    nose.style.transform =
      "translate(" +
      (nosePosition.x - nose.offsetWidth / 2) +
      "px," +
      (nosePosition.y - nose.offsetHeight / 2) +
      "px)";
    
    playerX = nosePosition.x;
    playerY = nosePosition.y;

    requestAnimationFrame(poseDetectionFrame);
  }

  poseDetectionFrame();
}

async function load() {
  const net = await posenet.load();
  detectPoseInRealTime(video, net);
}

video.onloadeddata = event => {
  load();
};


/* ----------------------------------*/
/* -------SECTION 3: GAME PLAY-------*/
/* ----------------------------------*/

function draw(){
  context.drawImage(bg,0,0);
  
  for(var i = 0; i < pipe.length; i++) {
    context.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
    context.drawImage(pipeSouth, pipe[i].x, pipe[i].y + pipeNorth.height + gap);
    
    pipe[i].x--;
    
    if(pipe[i].x == 125) {
      pipe.push({
        x : canvas.width,
        y : Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height
      });
      score++;
    }
    
    // detect collision
    var xBounds = ((playerX >= pipe[i].x) && (playerX <= pipe[i].x + pipeNorth.width));
    var yBounds = (playerY <= pipe[i].y + pipeNorth.height) || (playerY >= pipe[i].y + pipeNorth.height + gap);
    
    if(xBounds && yBounds){
      context.drawImage(gameOver, canvas.width/2 - gameOver.width/2, canvas.height/2 - gameOver.height/2);
      location.reload();
    }
    
  }
  
  context.fillStyle = "#000";
  context.font = "20px Verdana";
  context.fillText("Score: " + score,10,20);
  
}

// LOOP
function loop(){
    draw();
    requestAnimationFrame(loop);
}
loop();