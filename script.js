
// GLOBAL VAR & INPUT EVENT //////////////////////////////////////////

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const canvas2 = document.getElementById('canvas2');
const ctx2 = canvas2.getContext('2d');

canvas.width = 800;
canvas.height = 500;
canvas2.width = 800;
canvas2.height = 500;

const keys = [];
window.addEventListener("keydown", function(e){
  keys[e.keyCode] = true;
});
window.addEventListener("keyup", function(e){
  delete keys[e.keyCode];
  player.moving = false;
});

//// TEMP



//PLAYER LOGIN /////////////////////////////////////////////
const player = {
  x: 200,
  y: 200,
  width: 32,
  height: 48,
  frameX: 0,
  frameY: 0,
  speed: 9,
  moving: false
};

const playerSprite = new Image();
playerSprite.src = "img/player.png";
const background = new Image();
background.src = "img/background.png";

function drawSprite(img, sX, sY, sW, sH, dx, dY, dW, dH){
  ctx2.drawImage(img, sX, sY, sW, sH, dx, dY, dW, dH);
}

function movePlayer(){
  if(keys[38] && player.y > 10){
    player.y -= player.speed;
    player.frameY = 3;
    player.moving = true;
  }
  if(keys[37] && player.x > 0){
    player.x -= player.speed;
    player.frameY = 1;
    player.moving = true;
  }
  if(keys[40] && player.y < ((canvas.height) -player.height )){
    player.y += player.speed;
    player.frameY = 0;
    player.moving = true;
  }
  if(keys[39] && player.x < ((canvas.width) -player.width )){
    player.x += player.speed;
    player.frameY = 2;
    player.moving = true;
  }
}

function handlePlayerFrame(){
  if (player.frameX < 3 && player.moving)  player.frameX++;
    else player.frameX = 0;
}

// function animate(){
//   ctx.clearRect(0,0, canvas.width, canvas.height);
//   ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
//   drawSprite(playerSprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height,
//   player.x, player.y, player.width, player.height);
//   movePlayer();
//   handlePlayerFrame();
//   requestAnimationFrame(animate);
// }
// animate();

let fps, fpsInterval, startTime, now, then, elapsed;
function startAnimating(fps){
  fpsInterval = 1000/fps;
  then = Date.now();
  startTime = then;
  animate();
}
//Gameloop
function animate(){
  requestAnimationFrame(animate);
  now = Date.now();
  elapsed = now - then;
  if(elapsed > fpsInterval){
    then = now - (elapsed % fpsInterval);
      //only refresh fore ground canvas2
      ctx2.clearRect(0,0, canvas.width, canvas.height);
      // ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      // tile1 = new Tile(10, 10, 0, tileTypes.GRASS, 50, 50);
      // tile1.drawTile();
      // console.log(chunk1.tile.length);
      // console.log(chunk1.tile);



      //Handle Player Sprite
      drawSprite(playerSprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height,
      player.x, player.y, player.width, player.height);
      movePlayer();
      handlePlayerFrame();
  }
}



//// MAP GENERATION CODE/////////////////////////////////////////
// Tile Enum
const tileTypes = {
  GRASS: 'green',
  SAND: '#fdcb6e',
  WATER:  'cyan'
}

function genRandomTile(l1, l2){
  var _rand = Math.floor(Math.random() * 100);
  // console.log(_rand);
  var _tileType;
  switch (true) {
    case (_rand <= l1):
    _tileType = tileTypes.GRASS;
    break;
    case ((l1 < _rand) && (_rand <= l2)):
    _tileType = tileTypes.SAND;
    break;
    case ((l2 < _rand) && (_rand <= 100)):
    _tileType = tileTypes.WATER;
    break;
    // default:
    // _tileType = tileTypes.GRASS;
  }
  return _tileType;
}
//Tile object
class Tile {
  constructor(_x, _y, _z, _tileTypes, _width, _height){
    this.x = _x;
    this.y = _y;
    this.z = _z;
    this.tileType = _tileTypes;
    this.width = _width;
    this.height = _height;
  }
    drawTile() {


      if(this.z == 1 && (this.tileType != tileTypes.WATER)){
        ctx.fillStyle = 'orange';
        ctx.fillRect(this.x, this.y + (this.height - 10), this.width , 10);
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 5;
        ctx.shadowOffsetX = 0;
        ctx.shadowColor = "black";
        //draw High tiles
        ctx.fillStyle = "greenyellow";//this.tileType;
        ctx.fillRect(this.x, this.y, this.width , this.height - 10);

      }
        else {
          ctx.shadowBlur = 0;
          ctx.shadowColor = "transparent";
          //Draw normal tile
          ctx.fillStyle = this.tileType;
          ctx.fillRect(this.x, this.y, this.width , this.height);}


      //used for debug -- TODO remove in final versions
      // ctx.fillStyle = 'red';
      // ctx.fillText((this.y/50 * 16 + this.x/50) , this.x +20, this.y + 25);
  }

}
//Chunk Class
class Chunk {
  constructor(_tileNumX, _tileNumY){
    this.tileNumX = _tileNumX;
    this.tileNumY = _tileNumY;
    this.tile = [];
    }
    generateTile() {
      for (var py = 0; py < this.tileNumY; py++) {
          for (var px = 0; px < this.tileNumX; px++) {
              this.tile[py*this.tileNumX + px] = new Tile(px * 50, py *50, Math.floor(Math.random() * 3), genRandomTile(50, 90), 50, 50 );
          }
      }
    }
    drawChunk() {
      for (var i = 0; i < this.tile.length; i++) {
        if(this.tile[i]){
          var tempTile = new Tile(100, 100, 0, 'green', 50, 50 ); //temp dummy to cast properly after load

          console.log(this.tile[i]);
          Object.assign(tempTile, this.tile[i]);
          console.log(this.tile[i]);
          tempTile.drawTile();
        }

      }
    }
}
let chunk1 = new Chunk(16,10);
// load and return chunk Data
function loadChunk()
{
  // let chunk1 = new Chunk(16,10);
  var chunkValue = sessionStorage.getItem("SavedChunk");
  var parsedChunk1 = JSON.parse(chunkValue);
  Object.assign(chunk1, parsedChunk1);
  return chunk1;
}

function saveChunk(){
  chunk1.generateTile();
  let str = JSON.stringify(chunk1);

  sessionStorage.clear();
  sessionStorage.setItem("SavedChunk", str);
}
// StartGAME LOOP/////////////////////////////////////////////////
// localStorage.clear();


//LOAD MAP___________________
if(sessionStorage.getItem("SavedChunk") || 0 ){
    // chunk1.generateTile();
    chunk1 = loadChunk();
}
//SAVE MAP___________________
else {
  saveChunk();
}

// let chunk1 = new Chunk(16,10);
// chunk1.generateTile();

chunk1.drawChunk();
startAnimating(20);

window.onload = function(){

}
