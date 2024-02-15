import { Physics } from 'phaser';
import { Text } from './Text';

export class Actor extends Physics.Arcade.Sprite {
  protected hp = 100;
  private hpText: Text;
  public isDead: boolean = false;
  public collider: Phaser.Physics.Arcade.Collider;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.getBody().setCollideWorldBounds(true);
    this.getBody().setSize(80, 80);
    this.getBody().setOffset(10, -15);

    this.hpText = new Text(this.scene, this.x, this.y - this.height, this.hp.toString())
      .setFontSize(12)
      .setOrigin(0.8, 0.5);
  }

  public preUpdate(time, delta): void {
    if (this.hp > 0) {
      this.hpText.setText(this.hp.toString());
      this.hpText.setPosition(this.x, this.y - this.height * 0.4);
      super.preUpdate(time, delta);
    } else {
      this.hpText?.destroy();
      this.collider && this.scene.physics.world.removeCollider(this.collider)
      this.destroy();
    }
  }

  public getDamage(value: number = 20): void {
    console.log('damage')
    this.active && this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: 3,
      yoyo: true,
      alpha: 0.5,
      onStart: () => {
        if (value) {
          this.hp = this.hp - value;
          this.isDead = this.hp <= 0;
        }
      },
      onComplete: () => {
        this.setAlpha(1);
      },
    });
  }

  public getHPValue(): number {
    return this.hp;
  }

  getAngle(point: { x: number, y: number }, view: Physics.Arcade.Sprite) {
    const dx = point.x - view.x;
    const dy = point.y - view.y;
    const targetAngle = (360 / (2 * Math.PI)) * Math.atan2(dy, dx);

    return targetAngle;
  }

  updateAngle(point: { x: number, y: number }, view: Physics.Arcade.Sprite) {
    view.angle = this.getAngle(point, view);
  }

  protected getBody(): Physics.Arcade.Body {
    return this.body as Physics.Arcade.Body;
  }
}
