import { Scene } from 'phaser';
import { Scenes } from './scenes-enum';

export default class LoadingScene extends Scene {
  constructor(sceme: string = Scenes.LoadingScene) {
    super(sceme);
  }

  preload(): void {
    this.load.baseURL = './assets/v1/';

    // OTHER
    this.load.image('bullet', 'other/m_bullet.png');

    // SPRITE BG
    this.load.image('bg-block', 'other/bg-block.jpg');

    // v1

    this.load.image('player', 'player/default.png');

    this.load.image('zombie1', 'enemies/zombie1/idle.png');
    
    this.load.atlas('a-zombie1-move', 'enemies/zombie1/move.png', 'enemies/zombie1/zombie1-atlas.json');

    this.load.atlas('a-zombie1-attack', 'enemies/zombie1/attack.png', 'enemies/zombie1/zombie1-atlas.json');
  }

  create(): void {
    this.scene.start(Scenes.InitScene);

    this.input.setDefaultCursor('url(/assets/other/aim.cur), crosshair');

    this.initAnims();
  }

  initAnims(): void {
    this.anims.create({
      key: `a-zombie1-move`,
      frames: this.anims.generateFrameNames(`a-zombie1-move`, {
        prefix: `zombie1-move-`,
        end: 15,
      }),
      frameRate: 8,
    });

    this.anims.create({
      key: `a-zombie1-attack`,
      frames: this.anims.generateFrameNames(`a-zombie1-attack`, {
        prefix: `zombie1-attack-`,
        end: 8,
        start: 0
      }),
      frameRate: 8,
    });
  }
}
