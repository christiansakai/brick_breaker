(function(window) {
  let Phaser = window.Phaser;

  let StateOver = function() {};

  StateOver.prototype.init = function(points, lives) {
    this.points = points || 0;
    this.lives = lives || 0;
    this.bkg = null;
  };

  StateOver.prototype.create = function() {
    this.setupBackground();
    this.setupButtonBack();
    this.setupGameOverText();
    this.setupPointsText();
    this.setupFireworks();
  };

  StateOver.prototype.setupBackground = function() {
    this.bkg = this.game.add.tileSprite(0, 
                                        0, 
                                        this.game.world.width, 
                                        this.game.world.height, 
                                        "imgBkg");
  };

  StateOver.prototype.setupButtonBack = function() {
    let outFrame = 0;
    let overFrame = 1;
    let downFrame = 2;
    let margin = 30;
    let btnBack = this.game.add.button(0, 
                                       0, 
                                       'btnBack', 
                                       this.goToIntro, 
                                       this,
                                       overFrame,
                                       outFrame,
                                       downFrame);
    btnBack.anchor.set(0.5, 1);
    btnBack.x = this.game.world.centerX;
    btnBack.y = this.game.world.height - margin;
  };

  StateOver.prototype.setupGameOverText = function() {
    // Standard Lose
    let margin = 30;
    let txtOverConfig = {
      font: "40px Overlock",
      fill: "#FFF",
      align: "center"
    };

    let text = "Game Over";
    let sfxWinLose = this.game.add.audio("sfxLose");

    // Win
    if (this.lives > 0) {
      text = "Congratulations";
      txtOverConfig.fill = "#E0D700";
      sfxWinLose = this.game.add.audio("sfxWin");
    }

    let txtOver = this.game.add.text(0, 
                                     0, 
                                     text, 
                                     txtOverConfig);
    txtOver.anchor.x = 0.5;
    txtOver.x = this.game.world.centerX;
    txtOver.y = margin * 2;

    sfxWinLose.play();
  };

  StateOver.prototype.setupPointsText = function() {
    let margin = 30;
    let txtPointsConfig = {
      font: "28px Overlock",
      fill: "#FFF",
      align: "center"
    };

    let text = `${this.points} points`;

    let txtPoints = this.game.add.text(0, 
                                       0, 
                                       text,
                                       txtPointsConfig);
    txtPoints.anchor.x = .5;
    txtPoints.x = this.game.world.centerX;
    txtPoints.y = this.game.world.centerY - margin;
  };

  StateOver.prototype.setupFireworks = function() {
    this.sfxFirework = this.game.add.audio('sfxFirework');
    let maxParticles = 100;

    this.fireworks = this.game.add.emitter(0, 0, maxParticles);
    this.fireworks.makeParticles('imgStar');
    this.fireworks.gravity.y = 500;

    this.topTime = 1;
    this.timer = this.topTime;
  };

  StateOver.prototype.update = function() {
    this.moveBackground();

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      this.goToIntro();
    }

    if (this.lives > 0) {
      this.animateFireworks();
    }
  };

  StateOver.prototype.moveBackground = function() {
    this.bkg.tilePosition += 1;
  };

  StateOver.prototype.animateFireworks = function() {
    this.timer -= this.game.time.physicsElapsed;

    if (this.timer < 0) {
      this.timer = this.topTime;
      let randX = Math.random() * this.game.world.width;
      let randY = Math.random() * this.game.world.height;

      this.fireworks.x = randX;
      this.fireworks.y = randY;

      let duration = 800;
      let numStars = 10;

      this.fireworks.start(true, duration, null, numStars);
      this.sfxFirework.play();
    }
  };

  StateOver.prototype.goToIntro = function() {
    this.game.state.start("StateIntro");
  };

  window.StateOver = StateOver;

})(window);
