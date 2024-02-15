import { Actor } from './Actor';
import { Input, Scene } from 'phaser';
import Bullet from './Bullet';
import { throttle } from '../../utils/throttle';
import { BonusTypes } from './Bonus';

const getOffsetGunPlayer = (pointer: Input.Pointer, hero: Hero) => {
  // Получаем вектор направления от персонажа к указателю мыши
  const directionVector = new Phaser.Math.Vector2(pointer.worldX - hero.x, pointer.worldY - hero.y);

  // Получаем единичный вектор направления
  const unitDirectionVector = directionVector.clone().normalize();

  // Оффсет относительно центра персонажа (или точки, где находится оружие)
  const offsetFromCenter = new Phaser.Math.Vector2(30, 15); // Подставьте нужные вам значения

  // Вращаем оффсет вокруг центра на угол направления
  const rotatedOffset = offsetFromCenter.rotate(unitDirectionVector.angle());

  // Конечные координаты пули
  const bulletX = hero.x + rotatedOffset.x;
  const bulletY = hero.y + rotatedOffset.y;

  return {
    x: bulletX,
    y: bulletY,
  }
}

type Gun = BonusTypes.Riffle | BonusTypes.Shotgun | null;

export default class Hero extends Actor {
  private keyW: Input.Keyboard.Key;
  private keyA: Input.Keyboard.Key;
  private keyS: Input.Keyboard.Key;
  private keyD: Input.Keyboard.Key;
  private speed: number;
  public bullets: number;
  public activeGun: Gun;
  private fireDelay: number;
  private onShot: (b: Bullet) => void;
  private makeShot: () => void;

  constructor(scene: Scene, x: number, y: number, texture: string, onShot: (b: Bullet) => void)
  {
    super(scene, x, y, texture);

    this.keyW = this.scene.input.keyboard.addKey('W');
    this.keyA = this.scene.input.keyboard.addKey('A');
    this.keyS = this.scene.input.keyboard.addKey('S');
    this.keyD = this.scene.input.keyboard.addKey('D');
    this.bullets = Infinity;
    this.speed = 200;
    this.onShot = onShot;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.switchGun(null);
    this.initMakeShot();

    this.on('destroy', () => {
      // this.scene.game.scene.pause(Scenes.MainScene);
      this.scene.game.pause();
    });
  }

  initMakeShot = () => {
    this.makeShot = throttle(() => {
      const bullet = this.active && this.makeBullet();
      this.onShot(bullet);
    }, this.fireDelay).bind(this);
  }

  switchGun = (gun: Gun) => {
    if (this.activeGun === gun) {
      this.bullets += 50;
      return;
    }
    this.activeGun = gun;
    !this.activeGun && (this.bullets = Infinity) && (this.fireDelay = 250);
    this.activeGun && (this.bullets = 50) && (this.fireDelay = 70);
    this.initMakeShot();
  }

  makeBullet = () => {
    const pointer = this.scene.input.activePointer;
    this.bullets--;
    if (!this.bullets) this.switchGun(null);
    return new Bullet(this.scene, pointer.worldX, pointer.worldY, 'bullet', getOffsetGunPlayer(pointer, this));
  }

  update(_: number, __: number): void {
    const pointer = this.scene.input.activePointer;
    const pointerIsDown = pointer.isDown;
    this.getBody().setVelocity(0); // stop infinity run

    this.keyW?.isDown && !pointerIsDown && (this.body.velocity.y = -this.speed);
    this.keyA?.isDown && !pointerIsDown && (this.body.velocity.x = -this.speed);
    this.keyS?.isDown && !pointerIsDown && (this.body.velocity.y = this.speed);
    this.keyD?.isDown && !pointerIsDown && (this.body.velocity.x = this.speed);

    if (pointerIsDown) {
      // this.anims.play(`${this.atlasName}-shot`, true); // TODO
      this.makeShot && this.makeShot();
    }

    this.updateAngle(this.scene.input.activePointer, this);
  }
}
