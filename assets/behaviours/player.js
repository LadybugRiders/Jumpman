"use strict";

//>>LREditor.Behaviour.name: Player

var Player = function(_gameobject) {
	LR.Behaviour.call(this, _gameobject);

  this.speed = 200;

	this.cursors = this.go.game.input.keyboard.createCursorKeys();

  //get the feet shape by its name
  this.feetSensor = this.go.getShapeByName("feet");
  //use the inputManager to be notified when the JUMP key is pressed
  this.go.game.inputManager.bindKeyPress("jump",this.jump,this);

  //ANIMATIONS
  this.runAnim = this.entity.animations.add('run',[  1, 2, 3, 2, 1 ]);
  this.jumpAnim = this.entity.animations.add("jump", [ 5 ]);   
  this.idleAnim = this.entity.animations.add("idle", [ 0 ]); 

  //Make camera follow the player
  this.entity.game.camera.bounds = null;
  this.entity.game.camera.follow(this.entity,Phaser.Camera.FOLLOW_PLATFORMER);
};

Player.prototype = Object.create(LR.Behaviour.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  //KEY LEFT
	if (this.cursors.left.isDown) {
  	this.go.body.moveLeft(this.speed);

    if( this.onGround )
      this.entity.animations.play('run', 10, true);

  	if (this.go.entity.scale.x > 0) {
  		this.go.entity.scale.x = -1;
  	}
  //KEY RIGHT
  } else if (this.cursors.right.isDown) {
  	this.go.body.moveRight(this.speed);

    if( this.onGround )
      this.entity.animations.play('run', 10, true);

  	if (this.go.entity.scale.x < 0) {
  		this.go.entity.scale.x = 1;
  	}
  //IDLE ( no key pressed )
  }else if( this.onGround ){
    this.entity.body.velocity.x = 0;
    this.entity.animations.play('idle', 10, true);
  }
}

//This method is automatically called when the body of the player collides with another cody
Player.prototype.onBeginContact = function(_otherBody, _myShape, _otherShape, _equation){
  //if the collision is from the feet shape
  if( _myShape == this.feetSensor ){
    if( _otherBody.go.layer == "ground"){
      this.onGround = true;
    }else if(_otherBody.go.layer == "enemy"){
      _otherBody.go.sendMessage("kill");
      this.jump(true);
    }
  }
}

Player.prototype.jump = function(_force){
  if( this.onGround || _force == true){
    this.onGround = false;
    this.go.body.moveUp(600);
    this.entity.animations.play('jump', 10, true);
  }
}

Player.prototype.die = function(){
  //this.entity.game.state.start("Level",true,false,"level1");
  this.entity.game.state.restart(true);
}