import { Scene } from 'phaser';
import { Scenes } from './scenes-enum';

export enum EImage {
  PlayerHandgun = 'player-handgun',
  PlayerRiffle = 'player-riffle',
  Zombie1 = 'zombie1',
  Zombie1Move = 'a-zombie1-move',
  Zombie1Attack = 'a-zombie1-attack',
  // BgBlock = 'bg-block',
  // WallBlock = 'wall-block',
  ShadowBg = 'shadow-bg',
  Bullet = 'bullet',
}

export default class LoadingScene extends Scene {
  constructor(sceme: string = Scenes.LoadingScene) {
    super(sceme);
  }

  preload(): void {
    this.load.baseURL = './assets/v1/';

    // Other
    this.load.image(EImage.Bullet, 'other/m_bullet.png');
    this.load.image(EImage.ShadowBg, 'other/shadow.png');

    // Map
    // this.load.image(EImage.WallBlock, 'map/bg-block.jpg');
    // this.load.image(EImage.BgBlock, 'map/grey-tile.jpeg');

    // Bonuses
    this.load.image('riffle', 'ammo/riffle.png');
    this.load.image('armor', 'ammo/armor.png');
    this.load.image('health', 'ammo/health.png');
    this.load.image('shotgun', 'ammo/shotgun.png');
    this.load.image('ammo', 'ammo/ammo.png');

    // v1
    this.load.image(EImage.PlayerHandgun, 'player/default.png');
    this.load.image(EImage.PlayerRiffle, 'player/idle-riffle.png');
    this.load.image(EImage.Zombie1, 'enemies/zombie1/idle.png');
    this.load.atlas(EImage.Zombie1Move, 'enemies/zombie1/move.png', 'enemies/zombie1/zombie1-atlas.json');
    this.load.atlas(EImage.Zombie1Attack, 'enemies/zombie1/attack.png', 'enemies/zombie1/zombie1-atlas.json');

    // TEST
    // this.load.image('tileSet', 'tilesheet_complete.png');
    // this.load.tilemapTiledJSON('map1', 'map1.json');

    // ---
    this.load.image('tilesheet', 'map/tile_sheet/lava_100.png');
    this.load.tilemapTiledJSON('map', 'map-big-test.json');
  }

  create(): void {
    this.scene.start(Scenes.MainScene);

    this.input.setDefaultCursor('url(./assets/v1/other/aim.cur), crosshair');

    this.initAnims();
  }

  initAnims(): void {
    this.anims.create({
      key: EImage.Zombie1Move,
      frames: this.anims.generateFrameNames(EImage.Zombie1Move, {
        prefix: `zombie1-move-`,
        end: 15,
      }),
      frameRate: 8,
    });

    this.anims.create({
      key: EImage.Zombie1Attack,
      frames: this.anims.generateFrameNames(EImage.Zombie1Attack, {
        prefix: `zombie1-attack-`,
        end: 8,
        start: 0
      }),
      frameRate: 8,
    });
  }
}
