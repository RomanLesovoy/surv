import { Scene, Math } from 'phaser';
import { Actor } from './Actor';
import Hero from './Hero';
import { Text } from './Text';
import Bullet from './Bullet';
import config, { EnemyType, GameEvents } from '../config';
import { EAudio } from '../scenes/LoadScene';


export class Enemy extends Actor {
  private target: Hero;
  private textureName: string;
  public speed: number;
  private timer: number;
  protected damage: number;
  private deathSound: any;
  private stats: any; // todo

  constructor(
    scene: Scene,
    x: number,
    y: number,
    texture: string,
    target: Hero,
    type: EnemyType,
    wave: number = 1,
    level: number = 1,
  ) {
    super(scene, x, y, texture);
    this.target = target;
    this.textureName = type === EnemyType.Zombie ? `a-${texture}` : texture;

    this.stats = config.enemiesStats[`${type}Level${level}`];
    if (!this.stats) throw 'Enemy not found';

    this.speed = this.stats.speed + (wave * this.stats.speedWaveIncrease);
    this.timer = this.stats.timerAttack / 2;
    this.hp = this.stats.hp + (wave * this.stats.hpWaveIncrease);
    this.damage = this.stats.damage + (wave * this.stats.damageWaveIncrease);

    this.texts.push(new Text(scene, x, y, `Level ${level}`).setOrigin(0.6, -0.2).setFontSize(12));
    this.texts[1].setFontSize(10);

    this.getBody().setSize(this.stats.size, this.stats.size);
    this.setOffset(0, 0);
    this.setOrigin(0.5, 0.5);

    this.on(this.onKillEvent, () => {
      this.texts.forEach((t) => t?.destroy());
      this.deathSound.play();
      this.anims.play({ key: `${texture}-death` }, true);
      this.scene.game.events.emit(GameEvents.CreateRuby, this.body.x, this.body.y);
      this.scene.game.events.emit(GameEvents.AddScore, 10 + wave + (level * 10));

      setTimeout(() => {
        this.destroy();
      }, 3000)
    });

    this.on(Phaser.Scenes.Events.DESTROY, () => {
      this.texts.forEach((t) => t?.destroy());
    });

    this.init();
  }

  init() {
    this.deathSound = this.scene.sound.add(EAudio.Death);
  }

  public animateDamage(bullet: Bullet): void {
    const bulletVelocity = bullet.body.velocity.clone().normalize();
    const bulletVelocityX = bulletVelocity.x;
    const bulletVelocityY = bulletVelocity.y;
    
    this.setVelocity(bulletVelocityX * 1000, bulletVelocityY * 1000);
  }

  // 1 sec delay for attack
  private handleOnTimer(delta: number, callback: Function): void {
    this.timer += delta;
    while (this.timer >= this.stats.timerAttack) {
      this.timer -= this.stats.timerAttack;
      callback();
    }
  }

  private attackHandler(): void {
    this.anims.play({ key: `${this.textureName}-attack` }, true);
    this.target.getDamage(this.damage);
  }

  private run(): void {
    this.getBody().setVelocity(
      this.target.x > this.x ? this.speed : -this.speed,
      this.target.y > this.y ? this.speed : -this.speed,
    );

    !this.anims.isPlaying && this.anims.play({ key: `${this.textureName}-move` }, true);
  }

  public update(_: number, delta: number): void {
    this.getBody().setVelocity(0);
    const willAttack = Math.Distance.BetweenPoints(
      { x: this.target.x, y: this.target.y },
      { x: this.x, y: this.y },
    ) < 80;

    if (willAttack) {
      this.handleOnTimer(delta, () => {
        this.attackHandler();
      });
    } else {
      this.run();
    }
    this.updateAngle(this.target, this);
  }
}
