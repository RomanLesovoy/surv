import { Physics } from 'phaser';
import config from '../config';
import { EAudio, EImage } from '../scenes/LoadScene';
import { Coords } from '../../utils/types';

export default class Bullet extends Physics.Arcade.Sprite {
  public damage: number = 20;
  public direction!: Coords;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, from: Coords) {
    super(scene, from.x, from.y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.physics.world.enable(this);

    this.setCollideWorldBounds(false);
    this.body.setSize(4, 4);
    this.setDisplaySize(3, 3);
    this.direction = { x, y };
    this.setDepth(config.general.defaultBodyDepth);

    this.scene.sound.add(EAudio.Pistol).play();

    if (this.scene.cameras.main.zoom === 1) {
      const image = scene.add.image(from.x, from.y, EImage.PlayerFire).setDepth(config.general.defaultBodyDepth + 1);
      setTimeout(() => image?.destroy(), 50);
    }

    scene.physics.moveTo(this, this.direction.x, this.direction.y, 5000);
  }
}
