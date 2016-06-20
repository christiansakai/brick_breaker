var StateMain = {
  preload() {
  },

  create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.lives = 3;
    this.points = 0;

    // Sound
    this.sfxHitBrick = game.add.audio('sfxHitBrick');
    this.sfxHitPaddle = game.add.audio('sfxHitPaddle');
    this.bgmMusic = game.add.audio('bgmMusic');
    this.sfxLoseLife = game.add.audio('sfxLoseLife');

    this.bgmMusic.loop = true;
    // this.bgmMusic.play();
    
    // Background
    let { width: w, height: h } = game.world;
    this.bkg = game.add.sprite(0, 0, 'imgPaddle');

    // Paddle
    /* Paddle speed = 500 pixel/second */
    this.paddleVelX = 500 / 1000;

    /* Mouse X coordinate input */
    this.prevX = game.input.x;

    this.paddle = game.add.sprite(0, 0, 'imgPaddle');
    this.paddle.anchor.setTo(0.5, 1);

    this.paddleHalf = this.paddle.width / 2;

    game.physics.arcade.enable(this.paddle);
    this.paddle.body.enable = true;
    this.paddle.body.immovable = true;
      
    // Ball
    this.ball = game.add.sprite(0, 0, 'imgBall');

    game.physics.arcade.enable(this.ball)

    this.ball.isShot = false;
    this.ball.body.enable = true;
    this.ball.body.bounce.set(1);
    this.ball.body.collideWorldBounds = true;
    this.ball.iniVelX = 200;
    this.ball.iniVelY = -300;

    // Shoot the ball via mouse
    game.input.onDown.add(this.shootBall, this);

    // Shoot the ball via keyboard
    // TODO still not working
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      this.shootBall();
    }

    this.resetPaddle();

    this.ball.checkWorldBounds = true;
    this.ball.events.onOutOfBounds.add(this.loseLife, this);

    // Blackline Sprite (hard to see it because the background is black);
    h = this.paddle.height;
    let blackLine = game.add.tileSprite(0, 0, w, h, 'imgBlack');
    blackLine.anchor.set(0, 1);
    blackLine.y = game.world.height;

    // Lives
    this.txtLives = game.add.text(0, 0, g_txtLives + this.lives);
    this.txtLives.fontSize = 18;
    this.txtLives.fill = "#FFF";
    this.txtLives.align = "left";
    this.txtLives.font = "Overlock";
    this.txtLives.anchor.set(0, 1);
    this.txtLives.y = game.world.height;

    // Points
    let txtConfig = {
      font: "18px Overlock",
      fill: "#FFF",
      align: "right"
    };
    
    this.txtPoints = game.add.text(0, 0, this.points + g_txtPoints, txtConfig);
    this.txtPoints.anchor.set(1);
    this.txtPoints.x = game.world.width;
    this.txtPoints.y = game.world.height;


    // Brick
    this.numCols = 10;
    this.numRows = 4;

    this.bricks = game.add.group();

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

    // When the ball contact the bottom of the screen
    // it will dissapear off bounds instead of keep bouncing
    game.physics.arcade.checkCollision.down = false;


    // handle touch movement
    this.touchOldX = null;
    this.touchNewX = null;
    this.touchActive = false;
    this.touchMove = 0;
  },

  hitPaddle(ball, padle) {
    this.sfxHitPaddle.play();
  },

  loseLife() {
    this.resetPaddle();
    this.lives--;
    this.txtLives.text = g_txtLives + this.lives;

    if (this.lives == 0) {
      this.goToOver();
    }

    this.sfxLoseLife.play();
  },

  resetPaddle() {
    // Reset paddle position to the center of the screen
    this.paddle.x = game.world.centerX;
    this.paddle.y = game.world.height - this.paddle.height;

    // Reset ball position to the on top of the paddle
    this.ball.x = this.paddle.x;
    this.ball.y = this.paddle.y - this.paddle.height;
    this.ball.body.velocity.set(0);
    this.ball.isShot = false;
  },

  shootBall() {
    if (this.ball.isShot) return;



    let velX = this.ball.iniVelX;
    let velY = this.ball.iniVelY;

    let rand = Math.floor(Math.random() * 2);

    if (rand % 2 == 0) {
      velX *= -1;
    }

    this.ball.isShot = true;
    
    let state = game.state.getCurrentState();
    
    this.ball.body.velocity.set(velX, velY);

    this.sfxHitPaddle.play();
  },

  update() {
    game.physics.arcade.collide(this.ball, this.paddle);
    game.physics.arcade.collide(this.ball, this.paddle, this.hitPaddle, null, this);
    game.physics.arcade.collide(this.ball, this.bricks, this.removeBrick, null, this);

    // Paddle
    let isLeftDown = game.input.keyboard.isDown(Phaser.Keyboard.LEFT);
    let isRightDown = game.input.keyboard.isDown(Phaser.Keyboard.RIGHT);

    if (this.prevX !== game.inputx) {
      // Paddle location is following mouse X coordinate
      this.paddle.x = game.input.x;
      this.prevX = game.input.x;

      // handle touch movement
      if (game.device.touch && this.touchActive) {
        this.touchOldX = this.touchNewX;
        this.touchNewX = game.input.x;
        this.touchMove = 0;

        if (this.touchOldX !== null && this.touchNewX !== null) {
          this.touchMove = this.touchNewX - this.touchOldX;
        }

        this.paddle.x += this.touchMove;
      }
    } 
    
    // TODO
    // These two are not working if mouse input is active
    else if (isRightDown && !isLeftDown) {
      this.paddle.x += this.paddleVelX * game.time.physicsElapsedMS;
    } else if (isLeftDown && !isRightDown) {
      this.paddle.x -= this.paddleVelX * game.time.physicsElapsedMS;
    }

    // Prevent paddle to go out of screen
    if (this.paddle.x - this.paddleHalf < 0) {
      this.paddle.x = 0 + this.paddleHalf;
    }

    if (this.paddle.x + this.paddleHalf > game.world.width) {
      this.paddle.x = game.world.width - this.paddleHalf;
    }

    // Ball
    // Basically the ball will move along with the paddle
    // if it has not been shot yet
    if (this.ball.isShot === false) {
      this.ball.x = this.paddle.x;
    }

    // touch movement
    game.input.onDown.add(this.shootBall, this);
    game.input.onDown.add(this.onDwn, this);
    game.input.onUp.add(this.onUp, this);
  },

  onDown() {
    this.shootBall();
    this.touchActive = true;
  },

  onUp() {
    this.touchOldX = null;
    this.touchNewX = null;
    this.touchActive = false;
  },

  

  removeBrick(ball, brick) {
    brick.kill();

    this.points += 10;
    this.txtPoints.text = this.points + g_txtPoints;
    this.sfxHitBrick.play();

    if (this.bricks.countLiving() == 0) {
      this.goToOver();
    }
  },

  goToOver() {
    this.bgmMusic.stop();
    game.lives = this.lives;
    game.points = this.points;
    game.state.start('StateOver');
  }
};
