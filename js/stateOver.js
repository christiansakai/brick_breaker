let StateOver = {
  preload() {
  },

  create() {
    let points = 0;

    let { width: w, height: h } = game.world;

    this.bkg = game.add.tileSprite(0, 0, w, h, 'imgBkg');

    let outFrame = 0;
    let overFrame = 1;
    let downFrame = 2;
    let margin = 30;

    let btnBack = game.add.button(0, 0, 'btnBack', this.goToIntro, this.overFrame);
    btnBack.anchor.set(.5, 1);
    btnBack.x = game.world.centerX;
    btnBack.y = game.world.height - margin;

    let txtOverConfig = {
      font: "40px Overlock",
      fill: "#FFF",
      align: "center"
    };

    let txtOver = game.add.text(0, 0, g_txtGameOver, txtOverConfig);
    txtOver.anchor.x = 0.5;
    txtOver.x = game.world.centerX;
    txtOver.y = margin * 2;

    let lives = game.lives;
    points = game.points;

    let sfxWinLose;
    if (lives > 0) {
      txtOver.fill = "#E0D700";
      txtOver.text = g_txtCongrats;
      sfxWinLose = game.add.audio('sfxWin');
    } else {
      sfxWinLose = game.add.audio('sfxLose');
    }
    sfxWinLose.play();

    let txtPointsConfig = {
      font: "28px Overlock",
      fill: "#FFF",
      align: "center"
    };

    let txtPoints = game.add.text(0, 0, points + g_txtPoints, txtPointsConfig);
    txtPoints.anchor.x = .5;
    txtPoints.x = game.world.centerX;
    txtPoints.y = game.world.centerY - margin;


    // Fireworks after winning
    this.sfxFirework = game.add.audio('sfxFirework');
    let maxParticles = 100;

    this.fireworks = game.add.emitter(0, 0, maxParticles);
    this.fireworks.makeParticles('imgStar');
    this.fireworks.gravity.y = 500;

    this.topTime = 1;
    this.timer = this.topTime;

  },

  update() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      this.goToIntro();
    }

    let lives = game.lives;

    if (lives == 0) return;

    this.timer -= game.time.physicsElapsed;
    if (this.timer < 0) {
      this.timer = this.topTime;
      let randX = Math.random() * game.world.width;
      let randY = Math.random() * game.world.height;

      this.fireworks.x = randX;
      this.fireworks.y = randY;

      let duration = 800;
      let numStars = 10;

      this.fireworks.start(true, duration, null, numStars);
      this.sfxFirework.play();
    }
  },

  goToIntro() {
    game.state.start('StateIntro');
  }

};
