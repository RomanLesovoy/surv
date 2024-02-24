import { Physics } from 'phaser';
import { Text } from './Text';

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
  protected texts: Text[];
  public isDead: boolean = false;
  public myTexture: string;
  public collider: Phaser.Physics.Arcade.Collider;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    this.myTexture = texture;

    scene.add.existing(this);
    // scene.physics.add.existing(this);
    scene.physics.world.enable(this);

    this.getBody().setCollideWorldBounds(true);
    this.getBody().setSize(80, 80);
    this.getBody().setOffset(10, -15);

    this.texts = createTexts(this);
  }

  public handleTexts(): void {
    this.texts[0].setText(this.hp.toString()).setColor(this.hp > 50 ? '#38d738' : 'red');
    this.texts[1].setText(this.name);
    this.texts.forEach((t) => t.setPosition(this.x, this.y - this.height * 0.4));
  }

  public preUpdate(time, delta): void {
    if (this.hp > 0) {
      this.handleTexts();
      super.preUpdate(time, delta);
    } else {
      this.texts.forEach((t) => t?.destroy());
      this.collider && this.scene.physics.world.removeCollider(this.collider)
      this.destroy();
    }
  }

  public getDamage = (value: number): void => {
    this.hp = this.hp - value;
    this.isDead = this.hp <= 0;
  }

  public getHPValue(): number {
    return this.hp;
  }

  // getAngle(point: { x: number, y: number }, view: Physics.Arcade.Sprite) {
  //   const dx = point.x - view.x;
  //   const dy = point.y - view.y;
  //   const targetAngle = (360 / (2 * Math.PI)) * Math.atan2(dy, dx);

  //   return targetAngle;
  // }

  // updateAngle(point: { x: number, y: number }, view: Physics.Arcade.Sprite) {
  //   view.angle = this.getAngle(point, view);
  // }

  getAngle(point, view, cameras) {
    // Получаем координаты указателя мыши в системе координат игры с учетом положения камеры
    const pointerX = cameras.main.worldView.x + point.x / cameras.main.zoom;
    const pointerY = cameras.main.worldView.y + point.y / cameras.main.zoom;

    // Получаем вектор направления от игрока к указателю мыши
    const directionVector = new Phaser.Math.Vector2(pointerX - view.x, pointerY - view.y);

    // Получаем угол в градусах от вектора направления
    const targetAngle = Phaser.Math.RadToDeg(directionVector.angle());

    return targetAngle;
  }

  updateAngle(point, view, cameras) {
    // Обновляем угол игрока
    view.angle = this.getAngle(point, view, cameras);
  }

  protected getBody(): Physics.Arcade.Body {
    return this.body as Physics.Arcade.Body;
  }
}
