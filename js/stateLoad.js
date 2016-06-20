(function(window) {
  let Phaser = window.Phaser;

  let StateLoad = function() {};

  StateLoad.prototype.preload = function() {
    this.setupLoadingSprite();
    this.loadImages();
    this.loadAudio();
  };

  StateLoad.prototype.setupLoadingSprite = function() {
    let progVoid = this.game.add.image(0, 0, 'imgProgVoid');

    progVoid.x = this.game.world.centerX - progVoid.width / 2;
    progVoid.y = this.game.world.centerY;

    let progFull = this.game.add.image(0, 0, 'imgProgFull');

    progFull.anchor.x = progVoid.anchor.x;
    progFull.x = progVoid.x;
    progFull.y = progVoid.y;

    this.game.load.setPreloadSprite(progFull);
  };

  StateLoad.prototype.loadImages = function() {
    // Paddle
    this.game.load.image('imgPaddle', '/img/paddle.png');

    // Brick
    this.game.load.image('imgBrickGreen', '/img/brick_green.png');
    this.game.load.image('imgBrickPurple', '/img/brick_purple.png');
    this.game.load.image('imgBrickRed', '/img/brick_red.png');
    this.game.load.image('imgBrickYellow', '/img/brick_yellow.png');

    // Ball
    this.game.load.image('imgBall', '/img/ball.png');

    // Background
    this.game.load.image("imgBkg", '/img/bg_blue.png');
    this.game.load.image("imgBlack", '/img/bg_black.png');

    // Game Over
    this.game.load.spritesheet('btnBack', '/img/btn_back.png', 190, 49);
    this.game.load.image('imgStar', '/img/star.png');
  };

  StateLoad.prototype.loadAudio = function() {
    // Game Play
    this.game.load.audio('sfxHitBrick', '/snd/fx_hit_brick.wav');
    this.game.load.audio('sfxHitPaddle', '/snd/fx_hit_paddle.wav');
    this.game.load.audio('bgmMusic', '/snd/bgm_electric_air.ogg');
    this.game.load.audio('sfxLoseLife', '/snd/fx_lose_life.ogg');

    // Game Over
    this.game.load.audio('sfxLose', '/snd/fx_lose.ogg');
    this.game.load.audio('sfxWin', '/snd/fx_win.ogg');
    this.game.load.audio('sfxFirework', '/snd/fx_firework.ogg');
  };

  StateLoad.prototype.create = function() {
    this.game.state.start("StateIntro");
  };

  window.StateLoad = StateLoad;

})(window);
