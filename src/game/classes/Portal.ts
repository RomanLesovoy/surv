import { Physics, Scene } from 'phaser';
import { generateRandomCoordinatesCenter } from '../../utils/randomCoordinates';
import config from '../config';
import { EImage } from '../scenes/LoadScene';
import { Coords } from '../../utils/types';

export default class Portal extends Physics.Arcade.Sprite {
  coordinates!: Coords;
  portalCallback!: (coords: Coords) => void;

  constructor (scene: Scene, portalCallback: (coords: Coords) => void) {
    const coordinates = generateRandomCoordinatesCenter({ width: scene.scale.width, height: scene.scale.height });
    super(scene, coordinates.x, coordinates.y, EImage.PortalPreview);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setSize(200, 200);
    this.coordinates = coordinates;
    this.portalCallback = portalCallback;
    this.setDepth(config.general.defaultBodyDepth - 1);
    this.setOffset(0, 0);
    this.setOrigin(0.5, 0.5);

    setTimeout(() => {
      this.anims.play({ key: EImage.PortalAnim, yoyo: true, repeat: 50 }, true);
    }, 500);

    this.init();
  }

  init() {
    const timer = this.scene.time.addEvent({ delay: config.timeConfigs.portalCallback, callback: () => {
      this.portalCallback(this.coordinates);
      setTimeout(() => this?.destroy(), 50);
    }, loop: false });

    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      timer?.destroy();
    });
  }
}
