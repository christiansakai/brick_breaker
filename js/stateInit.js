let StateInit = {
  preload() {
    game.load.image('imgProgVoid', '/img/progress_void.png');
    game.load.image('imgProgFull', '/img/progress_full.png');
  },

  create() {
    game.scale.pageAlignHorizontally = true;

    if (!game.device.desktop) {
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }

    game.scale.refresh();
    game.state.start('StateLoad');
  }
};
