import { Game, Scale, WEBGL } from 'phaser';
import { scenes } from './scenes';

const config = {
  type: WEBGL,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#999999',
  scene: scenes,
  canvasStyle: `display: block; width: 100%; height: 100%;`,
  scale: {
    mode: Scale.ScaleModes.NONE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: {
    default: 'arcade',
    arcade: {
      skipQuadTree: false,
      debug: true,
    },
  },
  render: {
    antialiasGL: false,
    pixelArt: true,
  },
  autoFocus: true,
};

const game = new Game(config);

export default game;
