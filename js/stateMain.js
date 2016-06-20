(function(window) {
  let Phaser = window.Phaser;

  let StateMain = function() {};

  StateMain.prototype.init = function() {
    this.lives = 3;
    this.points = 0;
    this.numCols = 10;
    this.numRows = 4;
  };

  StateMain.prototype.create = function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.setupAudio();
    this.setupBackground();
    this.setupBricks();
    this.setupPaddle();
    this.setupBall();
    this.setupBlackline();
    this.setupLivesText();
    this.setupPointsText();
    this.setupBallControls();
  };

  StateMain.prototype.setupAudio = function() {
    // Sfx
    this.sfxHitBrick = this.game.add.audio('sfxHitBrick');
    this.sfxHitPaddle = this.game.add.audio('sfxHitPaddle');
    this.sfxLoseLife = this.game.add.audio('sfxLoseLife');

    // Bgm
    this.bgmMusic = this.game.add.audio('bgmMusic');
    this.bgmMusic.loop = true;
    this.bgmMusic.play();
  };

  StateMain.prototype.setupBackground = function() {
    this.bkg = this.game.add.tileSprite(0, 
                                        0, 
                                        this.game.world.width,
                                        this.game.world.height,
                                        'imgBkg');
  };

  StateMain.prototype.setupBricks = function() {
    this.bricks = this.game.add.group();

    this.bricks.enableBody = true;
    this.bricks.bodyType = Phaser.Physics.ARCADE;

    let brickImages = [
      'imgBrickGreen',
      'imgBrickPurple',
      'imgBrickRed',
      'imgBrickYellow'
    ];

    for (let i = 0; i < this.numRows; i++) {

      let img = brickImages[i];

      for (let j = 0; j < this.numCols; j++) {
        let brick = this.bricks.create(0, 0, img);

        brick.x = brick.width * j;
        brick.y = brick.height * i;
        brick.body.immovable = true;
      }
    }
  };

  StateMain.prototype.setupPaddle = function() {
    // Speed of paddle = 500 pixel / second;
    this.paddleVelX = 500 / 1000;

    this.paddle = this.game.add.sprite(0, 0, 'imgPaddle');
    this.paddle.anchor.setTo(0.5, 1);

    this.paddleHalf = this.paddle.width / 2;

    // Enable physics
    this.game.physics.arcade.enable(this.paddle);
    this.paddle.body.enable = true;
    this.paddle.body.immovable = true;

    this.resetPaddle();
  };

  StateMain.prototype.resetPaddle = function() {
    this.paddle.x = this.game.world.centerX;
    this.paddle.y = this.game.world.height - this.paddle.height;
  };

  StateMain.prototype.setupBall = function() {
    this.ball = this.game.add.sprite(0, 0, 'imgBall');

    this.game.physics.arcade.enable(this.ball)

    this.ball.isShot = false;
    this.ball.body.enable = true;
    this.ball.body.bounce.set(1);
    this.ball.body.collideWorldBounds = true;
    this.ball.iniVelX = 200;
    this.ball.iniVelY = -300;

    // When the ball contact the bottom of the screen
    // it will dissapear off bounds instead of keep bouncing
    this.game.physics.arcade.checkCollision.down = false;

    this.ball.checkWorldBounds = true;
    this.ball.events.onOutOfBounds.add(this.loseLife, this);

    this.resetBall();
  };

  StateMain.prototype.loseLife = function() {
    this.resetPaddle();
    this.resetBall();

    this.lives--;
    this.txtLives.text = `Lives: ${this.lives}`;

    if (this.lives == 0) {
      this.goToOver();
    }

    this.sfxLoseLife.play();
  };

  StateMain.prototype.resetBall = function() {
    this.ball.x = this.paddle.x;
    this.ball.y = this.paddle.y - this.paddle.height;
    this.ball.body.velocity.set(0);
    this.ball.isShot = false;
  };

  StateMain.prototype.setupBlackline = function() {
    let h = this.paddle.height;
    let w = this.game.world.width;

    let blackLine = this.game.add.tileSprite(0, 0, w, h, 'imgBlack');
    blackLine.anchor.set(0, 1);
    blackLine.y = this.game.world.height;
  };

  StateMain.prototype.setupLivesText = function() {
    this.txtLives = this.game.add.text(0, 0, `Lives: ${this.lives}`);
    this.txtLives.fontSize = 18;
    this.txtLives.fill = "#FFF";
    this.txtLives.align = "left";
    this.txtLives.font = "Overlock";
    this.txtLives.anchor.set(0, 1);
    this.txtLives.y = this.game.world.height;
  };

  StateMain.prototype.setupPointsText = function() {
    let txtConfig = {
      font: "18px Overlock",
      fill: "#FFF",
      align: "right"
    };
    
    this.txtPoints = this.game.add.text(0, 0, `${this.points} points`, txtConfig);
    this.txtPoints.anchor.set(1);
    this.txtPoints.x = this.game.world.width;
    this.txtPoints.y = this.game.world.height;
  };

  StateMain.prototype.setupBallControls = function() {
    // Shoot the ball via mouse
    this.game.input.onDown.add(this.shootBall, this);

    // Shoot the ball Via keyboard
    let spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spacebar.onDown.add(this.shootBall, this);
  };

  StateMain.prototype.shootBall = function() {
    if (this.ball.isShot) return;

    let velX = this.ball.iniVelX;
    let velY = this.ball.iniVelY;

    let rand = Math.floor(Math.random() * 2);

    if (rand % 2 == 0) {
      velX *= -1;
    }

    this.ball.isShot = true;
    this.ball.body.velocity.set(velX, velY);
    this.sfxHitPaddle.play();
  };

  StateMain.prototype.hitPaddle = function(ball, paddle) {
    this.sfxHitPaddle.play();
  };
  
  StateMain.prototype.removeBrick = function(ball, brick) {
    brick.kill();

    this.points += 10;
    this.txtPoints.text = `${this.points} points`;
    this.sfxHitBrick.play();

    if (this.bricks.countLiving() == 0) {
      this.goToOver();
    }
  };

  StateMain.prototype.goToOver = function() {
    this.bgmMusic.stop();
    this.game.state.start('StateOver', true, false, this.points, this.lives);
  };

  StateMain.prototype.update = function() {
    this.evaluateCollisions();
    this.evaluateControls();


    // Ball moves alongside paddle
    // if it has not been shot yet
    if (this.ball.isShot === false) {
      this.ball.x = this.paddle.x;
    }
    
    // Prevent paddle to go out of screen
    if (this.paddle.x - this.paddleHalf < 0) {
      this.paddle.x = 0 + this.paddleHalf;
    }

    if (this.paddle.x + this.paddleHalf > this.game.world.width) {
      this.paddle.x = this.game.world.width - this.paddleHalf;
    }
  };

  StateMain.prototype.evaluateCollisions = function() {
    this.game.physics.arcade.collide(this.ball, this.paddle, this.hitPaddle, null, this);
    this.game.physics.arcade.collide(this.ball, this.bricks, this.removeBrick, null, this);
  };

  StateMain.prototype.evaluateControls = function() {
    this.prevX = this.game.input.x;

    let isLeftDown = this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT);
    let isRightDown = this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT);

    if (this.prevX !== this.game.inputx) {
      // Paddle location is following mouse X coordinate
      this.paddle.x = this.game.input.x;
      this.prevX = this.game.input.x;

    } 
  };

  window.StateMain = StateMain;

})(window);
