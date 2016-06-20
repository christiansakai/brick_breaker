(function(window) {
  let Phaser = window.Phaser;

  let StateInit = function() {};

  StateInit.prototype.preload = function() {
    this.game.load.image("imgProgVoid", "/img/progress_void.png");
    this.game.load.image("imgProgFull", "/img/progress_full.png");
  };

  StateInit.prototype.create = function() {
    this.setResponsive();

    this.game.state.start("StateLoad");
  };

  StateInit.prototype.setResponsive = function(){
    this.game.scale.pageAlignHorizontally = true;

    if (!this.game.device.desktop) {
      this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }

    this.game.scale.refresh();
  };

  window.StateInit = StateInit;

})(window);
