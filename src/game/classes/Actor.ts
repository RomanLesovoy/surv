import { Physics } from 'phaser';
import { Text } from './Text';
import config from '../config';
import { Coords } from '../../utils/types';

const createTexts = (actor: Actor): Array<Text> => {
  return [
    new Text(actor.scene, actor.x, actor.y - actor.height, actor.hp.toString())
      .setFontSize(14)
      .setOrigin(0.8, 0.5),
    new Text(actor.scene, actor.x, actor.y - actor.height, actor.name)
      .setFontSize(14)
      .setColor('white')
      .setOrigin(0.6, 1.5)
  ];
}

export class Actor extends Physics.Arcade.Sprite {
  public hp = 100;
  public maxHp = 100;
  protected texts: Text[];
  public isDead: boolean = false;
  public myTexture: string;
  public collider: Phaser.Physics.Arcade.Collider;
  protected onKillEvent: string = 'onKill';

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    this.myTexture = texture;

    scene.add.existing(this);
    scene.physics.world.enable(this);

    this.getBody().setCollideWorldBounds(true);
    this.getBody().setSize(80, 80);
    this.setDepth(config.general.defaultBodyDepth)

    this.texts = createTexts(this);
  }

  public updateTexts(): void {
    this.texts[0].setText(this.hp.toString()).setColor(this.hp > this.maxHp / 2 ? '#38d738' : 'red');
    this.texts[1].setText(this.name);
    this.texts.forEach((t) => t.setPosition(this.x, this.y - this.height * 0.4));
  }

  public preUpdate(time, delta): void {
    super.preUpdate(time, delta);

    if (this.isDead) return;
    this.isDead = this.hp <= 0;

    if (!this.isDead) {
      return this.updateTexts();
    } else {
      this.anims.stop();
      this.texts.forEach((t) => t?.destroy());
      this.scene.physics.world.disable(this);
      this.collider && this.scene.physics.world.removeCollider(this.collider);
      this.emit(this.onKillEvent);
    }
  }

  public getDamage = (value: number): void => {
    this.hp = this.hp - value;
  }

  public getHPValue(): number {
    return this.hp;
  }

  getAngleCamera(point, view, cameras) {
    // Получаем координаты указателя мыши в системе координат игры с учетом положения камеры
    const pointerX = cameras.main.worldView.x + point.x / cameras.main.zoom;
    const pointerY = cameras.main.worldView.y + point.y / cameras.main.zoom;

    // Получаем вектор направления от игрока к указателю мыши
    const directionVector = new Phaser.Math.Vector2(pointerX - view.x, pointerY - view.y);

    // Получаем угол в градусах от вектора направления
    const targetAngle = Phaser.Math.RadToDeg(directionVector.angle());

    return targetAngle;
  }

  updateAngleCamera(point, view, cameras) {
    // Обновляем угол игрока
    view.angle = this.getAngleCamera(point, view, cameras);
  }

  getAngle(point: Coords, view: Physics.Arcade.Sprite) {
    const dx = point.x - view.x;
    const dy = point.y - view.y;
    const targetAngle = (360 / (2 * Math.PI)) * Math.atan2(dy, dx);

    return targetAngle;
  }

  updateAngle(point: Coords, view: Physics.Arcade.Sprite) {
    view.angle = this.getAngle(point, view);
  }

  protected getBody(): Physics.Arcade.Body {
    return this.body as Physics.Arcade.Body;
  }
}
