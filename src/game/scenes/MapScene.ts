import { Scene } from 'phaser'
import { Scenes } from './scenes-enum'
import { IMainScene, gameScenes, mainDataKey, otherScenes } from './MainScene';
import { defaultVolume } from '../classes/config';

export default class MapScene extends Scene {
  protected mainScene: IMainScene;

  constructor() {
    super(Scenes.MapScene);
  }

  init(data: { [mainDataKey]: IMainScene }) {
    this.mainScene = data[mainDataKey];
    this.sound.volume = defaultVolume; // todo
  }

  setCameraView(scale) {
    setTimeout(() => {
      this.cameras.main.setZoom(scale);
      this.cameras.main.setSize(this.game.scale.width, this.game.scale.height)
      this.cameras.main.zoom > 1
        ? this.cameras.main.startFollow(this.mainScene.hero, false, 0.1, 0.1)
        : this.cameras.main.stopFollow()
      this.cameras.main.zoom <= 1 && this.setCameraCenter();
      // this.cameras.main.setBounds(0, 0, this.game.scale.width * 2, this.game.scale.height * 2, true)
    }, 0);
  }

  setCameraCenter() {
    const sceneWidth = this.game.scale.width;
    const sceneHeight = this.game.scale.height;

    const cameraWidth = this.cameras.main.width;
    const cameraHeight = this.cameras.main.height;

    const centerX = (sceneWidth - cameraWidth) / 2;
    const centerY = (sceneHeight - cameraHeight) / 2;

    this.cameras.main.setScroll(centerX, centerY);
  }

  createScenes = () => {
    const sharedThis = { [mainDataKey]: this.mainScene };
    [otherScenes, gameScenes].flat()
      .forEach((s) => this.game.scene.getIndex(s[0] as Scenes) === -1 && this.scene.add(s[0] as Scenes, s[1] as any, false, sharedThis));
  }

  create() {
    this.createScenes();
    this.input.on('wheel', this.handleWheel, this);
    this.setCameraView(1);

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
    }, 100);
  }

  handleWheel = (_pointer, _gameObjects, _deltaX, deltaY, _deltaZ) => {
    const zoomSpeed = 0.5;
    deltaY < 0 && this.cameras.main.zoom < 2 && (this.cameras.main.zoom += zoomSpeed);
    deltaY > 0 && this.cameras.main.zoom > 1 && (this.cameras.main.zoom -= zoomSpeed);

    this.setCameraView(this.cameras.main.zoom);
  }
}
