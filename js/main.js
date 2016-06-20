let game;

function onLoad() {
  game = new Phaser.Game(640, 400, Phaser.AUTO, "phaser-game");

  game.state.add('StateInit', StateInit);
  game.state.add('StateLoad', StateLoad);
  game.state.add('StateIntro', StateIntro);
  game.state.add('StateMain', StateMain);
  game.state.add('StateOver', StateOver);

  game.state.start('StateInit');
}

window.onload = onLoad;
