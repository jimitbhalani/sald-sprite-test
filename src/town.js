var sprite = require('sald:Sprite.js');
var heroImg = require('../img/bing.png');
var secondImg= require('../img/hero2.png');

var heroSprite = new sprite(heroImg,
{
	'up':{
		    x:0,y:0,width:50,height:60,size:6
	},
	'down':{
		    x:0,y:120,width:50,height:60,size:6
	},
	'left':{
		    x:0,y:180,width:50,height:60,size:6
	},
	'right':{
		x:0,y:60,width:50,height:60,size:6
	}
});

var TileSize = 20;
var PlayerSpeed = 4.0; //tiles per second

var tilesImg = require("../img/ground.png");

var map = [
[6,1,1,1,1,1,1,1,8],
[3,4,4,4,4,4,4,4,3],
[3,4,4,6,7,8,4,4,3],
[3,4,4,5,4,3,4,4,3],
[3,4,4,3,4,3,4,4,3],
[3,4,4,4,4,5,4,4,3],
[3,4,4,0,1,2,4,4,3],
[3,4,4,4,4,4,4,4,3],
[3,4,4,4,4,4,4,4,3],
[3,4,4,4,4,4,4,4,3],
[0,1,1,1,1,1,1,1,2]
];

//camera position (in tiles):
var camera = {
	x: 4.5,
	y: 5.5
};

//player position (in tiles):
var player = {
	x: 4.5,
	y: 5.5,
	frameAcc: 0.0,
	frame: 0,
};

//define booleans for moving up, down,left, right and idle animations
var up  = false;
var down = false;
var right = false;
var left = false;
var idle = false;

function draw() {
	var ctx = sald.ctx;

	//First, clear the screen:
	ctx.setTransform(ctx.factor,0, 0,ctx.factor, 0,0);
	ctx.fillStyle = "#f0f"; //bright pink, since this *should* be drawn over

	ctx.fillRect(0, 0, 320, 240); //<--- hardcoded size. bad style!

	//don't interpolate scaled images. Let's see those crisp pixels:
	ctx.imageSmoothingEnabled = false;

	//Now transform into camera space:
	//  (units are tiles, +x is right, +y is up, camera is at the center:
		ctx.setTransform(
		//x direction:
		ctx.factor * TileSize, 0,
		//y direction (sign is negative to make +y up):
		0,-ctx.factor * TileSize,
		//offset (in pixels):
		ctx.factor * (320 / 2 - Math.round(camera.x * TileSize)),
			ctx.factor * (240 / 2 + Math.round(camera.y * TileSize)) //<-- y is added here because of sign flip
			);

		(function drawTiles() {
		//Find bounds of current view (avoid drawing offscreen tiles):
		var minTile = {
			x: Math.floor(camera.x - (320 / 2 / TileSize)) | 0,
			y: Math.floor(camera.y - (240 / 2 / TileSize)) | 0
		};
		var maxTile = {
			x: Math.floor(camera.x + (320 / 2 / TileSize)) | 0,
			y: Math.floor(camera.y + (240 / 2 / TileSize)) | 0
		};

		//loop over all tiles in the view and draw them:
		for (var ty = minTile.y; ty <= maxTile.y; ++ty) {
			for (var tx = minTile.x; tx <= maxTile.x; ++tx) {
				/*
				//Disco Mode:
				ctx.fillStyle = "rgb("
					+ Math.round(Math.random() * 256) + ","
					+ Math.round(Math.random() * 256) + ","
					+ Math.round(Math.random() * 256) + ")";
				ctx.fillRect(tx, ty, 1, 1);
				*/

				var idx;
				if (ty >= 0 && ty < map.length && tx >= 0 && tx < map[ty].length) {
					idx = map[ty][tx];
				} else {
					idx = 4;
				}

				ctx.save();
				//locally flip the 'y' axis since images draw with upper-left origins:
				ctx.transform(1,0, 0,-1, tx, ty+1);

				ctx.drawImage(tilesImg, (idx % 3) * TileSize, ((idx / 3) | 0) * TileSize, TileSize, TileSize, 0,0, 1, 1);
				ctx.restore();
			}
		}


	})();

	//draw the player:
	(function draw_player() {

     //clip spritesheets to play specific animations on keypresses
	 if(down)
	   heroSprite.draw('down',player.x,player.y,0,1,1,0.5,0.5); 

      if(up)
       heroSprite.draw('up',player.x,player.y,0,1,1,0.5,0.5);

      if(left)
       heroSprite.draw('left',player.x,player.y,0,1,1,0.5,0.5);	

      if(right)
       heroSprite.draw('right',player.x,player.y,0,1,1,0.5,0.5);

     if(idle)
       heroSprite.draw('up',player.x,player.y,0,1,1,0.5,0.5);

})();

	//rounded corners:
	ctx.setTransform(ctx.factor,0, 0,ctx.factor, 0,0);
	ctx.fillStyle = "#452267"; //background color of page
	ctx.fillRect(0,0, 1,2);
	ctx.fillRect(1,0, 1,1);

	ctx.fillRect(0,238, 1,2);
	ctx.fillRect(1,239, 1,1);

	ctx.fillRect(319,0, 1,2);
	ctx.fillRect(318,0, 1,1);

	ctx.fillRect(319,238, 1,2);
	ctx.fillRect(318,239, 1,1);

}

function update(elapsed) {
	var keys = sald.keys;
     
        var command = {
        	x:0.0,
        	y:0.0
        };
	//First column is 'wasd', second is arrow keys:
	//if (keys.A) command.x -= 1.0;
	//if (keys.D) command.x += 1.0;
	//if (keys.S) command.y -= 1.0;
	//if (keys.W) command.y += 1.0;

	//on key press, draw the spritesheet animation, loop a certain animation with certain speed
	if (keys.S)
	{
       command.y -= 1.0;
       down = true;
       up = false;
       left = false;
       right = false;
       idle = false;
       heroSprite.animators['down'].loop(true);
	   heroSprite.animators['down'].speed(20);
	}
	else if (keys.W) 
	{
       command.y += 1.0;
       down = false;
       up = true;
       left = false;
       right = false;
        idle = false;
       heroSprite.animators['up'].loop(true);
	   heroSprite.animators['up'].speed(20);
	}
	else if( keys.A)
	{
       command.x -= 1.0;
       down = false;
       up = false;
       left = true;
       right = false;
        idle = false;
       heroSprite.animators['left'].loop(true);
	   heroSprite.animators['left'].speed(20);
	}
	else if(keys.D)
	{
	   command.x += 1.0;
	   down = false;
       up = false;
       left = false;
       right = true;
        idle = false;
       heroSprite.animators['right'].loop(true);
	   heroSprite.animators['right'].speed(20);
	}


	if (command.x != 0.0 || command.y != 0.0) {
		var len = Math.sqrt(command.x * command.x + command.y * command.y);
		command.x /= len;
		command.y /= len;

		player.x += command.x * PlayerSpeed * elapsed;
		player.y += command.y * PlayerSpeed * elapsed;

		//use the animators
		//heroSprite.animators['down'].loop(true);
		//heroSprite.animators['down'].speed(20);
       
		
	//if no keys are pressed, stop looping all the current animations and set idle animation to true
	} else {
		//player is stopped:
		heroSprite.animators['down'].stop();
		heroSprite.animators['up'].stop();
		heroSprite.animators['left'].stop();
		heroSprite.animators['right'].stop();
		idle = true;
	}

	//pan camera if player is within 3 tiles of the edge:
	camera.x = Math.max(camera.x, player.x - (320 / TileSize / 2 - 3));
	camera.x = Math.min(camera.x, player.x + (320 / TileSize / 2 - 3));
	camera.y = Math.max(camera.y, player.y - (240 / TileSize / 2 - 3));
	camera.y = Math.min(camera.y, player.y + (240 / TileSize / 2 - 3));

}

function key(key, state) {
	//don't do anything
}


module.exports = {
	draw:draw,
	update:update,
	key:key
};
