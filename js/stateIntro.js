(function(window) {
  let Phaser = window.Phaser;

  let StateIntro = function() {};
  
  StateIntro.prototype.init = function() {
    this.bkg = null;
  };

  StateIntro.prototype.preload = function() {
    this.game.load.image("imgBkg", "/img/bg_blue.png");
    this.game.load.image("imgLogo", "/img/logo_game.png");

    this.game.load.spritesheet("btnStart", "/img/btn_start.png", 190, 49);
  };

  StateIntro.prototype.create = function() {
    this.addBackground();
    this.addLogo();
    this.addStartButton();
  };

  StateIntro.prototype.addBackground = function() {
    this.bkg = this.game.add.tileSprite(0, 
                                        0, 
                                        this.game.world.width, 
                                        this.game.world.height, 
                                        "imgBkg");
  };

  StateIntro.prototype.addLogo = function() {
    let marginTop = 30;
    let logo = this.game.add.image(0, 0, "imgLogo");

    logo.anchor.x = 0.5;
    logo.x = this.game.world.centerX;
    logo.y = marginTop;
  };

  StateIntro.prototype.addStartButton = function() {
    let outFrame = 0;
    let overFrame = 1;
    let downFrame = 2;
    let btnStart = this.game.add.button(0, 
                                        0, 
                                        "btnStart", 
                                        this.goToMain, 
                                        this, 
                                        overFrame, 
                                        outFrame, 
                                        downFrame);

    btnStart.anchor.x = .5;
    btnStart.x = this.game.world.centerX;
    btnStart.y = this.game.world.centerY;
  };

  StateIntro.prototype.update = function() {
    this.moveBackground();

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      this.goToMain();
    }
  };

  StateIntro.prototype.moveBackground = function() {
    this.bkg.tilePosition.y += 1;
  };

  StateIntro.prototype.goToMain = function() {
    this.game.state.start("StateMain");
  };

  window.StateIntro = StateIntro;

})(window);
