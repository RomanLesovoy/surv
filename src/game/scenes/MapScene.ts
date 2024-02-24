import { Scene } from 'phaser'
import { Scenes } from './scenes-enum'
import { IMainScene, mainDataKey } from './MainScene';

export default class MapScene extends Scene {
  protected mainScene: IMainScene;

  constructor() {
    super(Scenes.MapScene);
  }

  init(data: { [mainDataKey]: IMainScene }) {
    this.mainScene = data[mainDataKey];
  }

  initView() {
    this.cameras.main.setSize(this.game.scale.width, this.game.scale.height);
    this.cameras.main.setZoom(1);
    // this.cameras.main.setScroll(500, 1000)

    setTimeout(() => {
      // this.cameras.main.startFollow(this.mainScene.hero, false);
    })
  }

  create() {
    this.initView()

    this.mainScene.map = this.add.tilemap('map');
    const tileset = this.mainScene.map.addTilesetImage('tilesheet', 'tilesheet');
    this.mainScene.map.createLayer('background', [tileset], 0, 0).setAlpha(1).setDepth(1);
    const wallLayer = this.mainScene.map.createLayer('walls', [tileset], 0, 0).setAlpha(1).setDepth(2);
    const worldLayer = this.mainScene.map.createLayer('world', [tileset], 0, 0).setDepth(3);

    const debugGraphics = this.add.graphics().setAlpha(0.6);
    wallLayer.renderDebug(debugGraphics)
    wallLayer.setCollisionByProperty({ collides: true }, true);
    worldLayer.setCollisionByProperty({ collides: true }, true);

    setTimeout(() => {
      this.physics.world.enable(this.mainScene.hero);
      this.physics.add.collider(this.mainScene.hero, wallLayer, () => false);
      this.physics.add.collider(this.mainScene.hero, worldLayer, () => false);
    });
  }

  // create() {
  //   let map1 = this.add.tilemap('map1');
  //   let tileSet = map1.addTilesetImage('tilesheet_complete', 'tileSet');
  //   let topLayer = map1.createLayer('top', [tileSet], 0, 0).setDepth(1);
  //   let botLayer = map1.createLayer('bottom', [tileSet], 0, 0).setDepth(0);
  //   topLayer.setCollisionByProperty({collides:true}, true);

  //   setTimeout(() => {
  //     this.physics.world.enable(this.mainScene.hero)
  //     this.physics.add.collider(this.mainScene.hero, topLayer, (a: any, t) => {
  //       return false;
  //     });
  //   })
  // }
}
