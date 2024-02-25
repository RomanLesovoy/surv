import { Scene, Math } from 'phaser';
import { Actor } from './Actor';
import Hero from './Hero';
import { Text } from './Text';
import { GameEvents } from '../game-events';
import Bullet from './Bullet';
import { defaultEnemyStats } from './config';
import { EAudio } from '../scenes/LoadScene';

export class Enemy extends Actor {
  private target: Hero;
  private atlasName: string;
  public speed: number;
  private timer: number;
  protected damage: number;
  private deathSound: any;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    texture: string,
    target: Hero,
    level: number = 1,
  ) {
    super(scene, x, y, texture);
    this.target = target;
    this.atlasName = `a-${texture}`;
    this.speed = defaultEnemyStats.speed + (level * defaultEnemyStats.speedWaveIncrease);
    this.timer = defaultEnemyStats.timerAttack;
    this.hp = defaultEnemyStats.hp + (level * defaultEnemyStats.hpWaveIncrease);
    this.damage = defaultEnemyStats.damage + (level * defaultEnemyStats.damageWaveIncrease);

    this.getBody().setOffset(0, 15);
    this.texts.push(new Text(scene, x, y, `Level ${level}`).setOrigin(0.6, -0.2).setFontSize(12));
    this.texts[1].setFontSize(10);

    this.on('destroy', () => {
      this.texts.forEach((t) => t?.destroy());
      if (this.isDead) {
        this.deathSound.play();
        this.scene.game.events.emit(GameEvents.CreateRuby, this.body.x, this.body.y);
        this.scene.game.events.emit(GameEvents.AddScore, 10 + level);
      }
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
    while (this.timer >= defaultEnemyStats.timerAttack) {
      this.timer -= defaultEnemyStats.timerAttack;
      callback();
    }
  }

  private attackHandler(): void {
    !this.anims.isPlaying && this.anims.play({ key: `${this.atlasName}-attack`, frameRate: Math.RoundTo(this.speed / 5, 0) }, true);
    this.target.getDamage(this.damage);
  }

  private run(): void {
    this.getBody().setVelocity(
      this.target.x > this.x ? this.speed : -this.speed,
      this.target.y > this.y ? this.speed : -this.speed,
    );
    !this.anims.isPlaying && this.anims.play({ key: `${this.atlasName}-move`, frameRate: Math.RoundTo(this.speed / 5, 0) }, true);
  }

  public update(_: number, delta: number): void {
    const willAttack = Math.Distance.BetweenPoints(
      { x: this.target.x, y: this.target.y },
      { x: this.x, y: this.y },
    ) < (this.target.width - 20);

    if (willAttack) {
      this.handleOnTimer(delta, () => {
        this.getBody().setVelocity(0);
        this.attackHandler();
      });
    } else {
      this.run();
    }
    this.updateAngle(this.target, this);
  }
}
