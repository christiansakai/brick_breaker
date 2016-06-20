var StateIntro = {
  preload() {
    game.load.image('imgBkg', '/img/bg_blue.png');
    game.load.image('imgLogo', '/img/logo_game.png');

    game.load.spritesheet('btnStart', '/img/btn_start.png', 190, 49);
  },

  create() {
    // Default
    let { width: w, height: h } = game.world;

    this.bkg = game.add.tileSprite(0, 0, w, h, 'imgBkg');

    let marginTop = 30;
    let logo = game.add.image(0, 0, 'imgLogo');

    logo.anchor.x = .5;
    logo.x = game.world.centerX;
    logo.y = marginTop;

    // Button
    let outFrame = 0;
    let overFrame = 1;
    let downFrame = 2;
    let btnStart = game.add.button(0, 0, 'btnStart', this.goToMain, this, 
                                   overFrame, outFrame, downFrame);

    btnStart.anchor.x = .5;
    btnStart.x = game.world.centerX;
    btnStart.y = game.world.centerY;
  },

  update() {
    this.bkg.tilePosition.y += 1;

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      this.goToMain();
    }
  },

  goToMain() {
    game.state.start('StateMain');
  }
};
