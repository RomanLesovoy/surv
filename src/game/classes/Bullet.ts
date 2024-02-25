import { Physics } from 'phaser';
import { defaultBodyDepth } from './config';

export default class Bullet extends Physics.Arcade.Sprite {
  public damage: number = 20;
  public direction!: { x: number, y: number };

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, from: { x: number, y: number }) {
    super(scene, from.x, from.y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.physics.world.enable(this);

    this.setCollideWorldBounds(false);
    this.body.setSize(4, 4);
    this.direction = { x, y };
    this.setDepth(defaultBodyDepth);

    scene.physics.moveTo(this, this.direction.x, this.direction.y, 5000);
  }
}
