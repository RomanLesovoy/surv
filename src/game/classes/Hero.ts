import { Actor } from './Actor';
import { GameObjects, Input, Scene } from 'phaser';
import Bullet from './Bullet';
import { throttle } from '../../utils/throttle';
import { BonusTypes } from './Bonus';
import { EAudio, EImage } from '../scenes/LoadScene';
import { emitGameStatus, GameStatus } from '../scenes/MainScene';
import { defaultBodyDepth, defaultHeroStats } from './config';
import { Text } from './Text';

const getOffsetGunPlayer = (pointer: Input.Pointer, hero: Hero, cameras) => {
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

  const screenPoint = cameras.main.getWorldPoint(pointer.x, pointer.y); // TODO worldX, worldY

  return {
    x: bulletX,
    y: bulletY,
    screenPoint,
  }
}

type Gun = BonusTypes.Riffle | BonusTypes.Shotgun | null;

export default class Hero extends Actor {
  private keyW: Input.Keyboard.Key;
  private keyA: Input.Keyboard.Key;
  private keyS: Input.Keyboard.Key;
  private keyD: Input.Keyboard.Key;
  public speed: number;
  public maxHp: number;
  public bullets: number;
  public activeGun: Gun;
  private fireDelay: number;
  public damage: number;
  private bulletImg: GameObjects.Image;
  private onShot: (b: Bullet) => void;
  private makeShot: () => void;
  private bulletsText: Text;
  private runSound: any;

  constructor(scene: Scene, heroScene: Scene, x: number, y: number, onShot: (b: Bullet) => void)
  {
    super(scene, x, y, EImage.PlayerHandgun);

    const {
      input, game
    } = this.scene;

    this.keyW = input.keyboard.addKey('W');
    this.keyA = input.keyboard.addKey('A');
    this.keyS = input.keyboard.addKey('S');
    this.keyD = input.keyboard.addKey('D');
    
    this.resetHero();
    this.onShot = onShot;
    this.initMakeShot();
    this.setInteractive();

    this.on('destroy', () => {
      game.events.emit(emitGameStatus, GameStatus.NotStarted);
    });

    this.runSound = this.scene.sound.add(EAudio.HeroRun, {volume: 1});
    this.bulletImg = heroScene.add.image(game.scale.width - 300, game.scale.height - 50, EImage.BulletAmmo).setVisible(false).setDepth(defaultBodyDepth);
    this.bulletsText = new Text(heroScene, game.scale.width - 250, game.scale.height - 75, '').setDepth(defaultBodyDepth);
  }

  public resetHero = () => {
    this.bullets = Infinity;
    this.speed = defaultHeroStats.speed;
    this.hp = defaultHeroStats.hp;
    this.maxHp = defaultHeroStats.hp;
    this.damage = defaultHeroStats.damage;
    this.switchGun(null);
    this.setPosition(this.scene.game.scale.width / 2, this.scene.game.scale.height / 2);
  }

  getTexture = () => {
    if (this.activeGun) {
      return EImage.PlayerRiffle;
    }
    return EImage.PlayerHandgun;
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
    this.setTexture(this.getTexture());
  }

  makeBullet = () => {
    const pointer = this.scene.input.activePointer;
    this.bullets--;
    if (!this.bullets) this.switchGun(null);
    const offset = getOffsetGunPlayer(pointer, this, this.scene.cameras);
    return new Bullet(this.scene, offset.screenPoint.x, offset.screenPoint.y, EImage.Bullet, { x: offset.x, y: offset.y });
  }

  showLeftBullets = () => {
    if (this.bullets === Infinity) {
      this.bulletImg.setVisible(false);
      return this.bulletsText.setText('');
    }
    this.bulletImg.setVisible(true);
    return this.bulletsText.setText(`${this.bullets}`);
  }

  update(_: number, __: number): void {
    const pointer = this.scene.input.activePointer;
    const pointerIsDown = pointer.isDown;
    this.showLeftBullets();
    this.getBody().setVelocity(0); // stop infinity run
    const isRunning = (this.keyW?.isDown || this.keyA?.isDown || this.keyS?.isDown || this.keyD?.isDown) && !pointerIsDown;
    isRunning && !this.runSound.isPlaying && this.runSound.play();
    !isRunning && this.runSound.stop();

    this.keyW?.isDown && !pointerIsDown && this.getBody().setVelocityY(-this.speed);
    this.keyA?.isDown && !pointerIsDown && this.getBody().setVelocityX(-this.speed);
    this.keyS?.isDown && !pointerIsDown && this.getBody().setVelocityY(this.speed);
    this.keyD?.isDown && !pointerIsDown && this.getBody().setVelocityX(this.speed);

    if (pointerIsDown) {
      // this.anims.play(`${this.atlasName}-shot`, true); // TODO
      this.makeShot && this.makeShot();
    }

    this.updateAngleCamera(this.scene.input.activePointer, this, this.scene.cameras);
  }
}
