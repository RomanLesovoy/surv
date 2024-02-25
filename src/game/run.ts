import { Game, Scale } from 'phaser';
import { scenes } from './scenes';

const size = 100 * 20; // 1 - tile size, 2 - tiles for row

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#070707',
  scene: scenes,
  // canvasStyle: `display: block; width: 100%; height: 100%;`,
  scale: {
    mode: Scale.ScaleModes.FIT,
    width: size,
    height: size,
  },
  physics: {
    default: 'arcade',
    arcade: {
      // skipQuadTree: false,
      debug: false,
    },
  },
  render: {
    antialiasGL: false,
    pixelArt: false,
  },
  autoFocus: true,
};

const game = new Game(config);

export default game;
