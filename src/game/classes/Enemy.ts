import { Scene, Math } from 'phaser';
import { Actor } from './Actor';
import Hero from './Hero';
import { Text } from './Text';
import { GameEvents } from '../game-events';
import Bullet from './Bullet';

export class Enemy extends Actor {
  private target: Hero;
  private atlasName: string;
  public speed: number;
  private timer: number;

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
    this.speed = 50 + (level * 10);
    this.timer = 1000;
    this.hp = 90 + (level * 10);

    // scene.add.existing(this);
    // scene.physics.add.existing(this);

    this.getBody().setOffset(0, 15);
    this.texts.push(new Text(scene, x, y, `Level ${level}`).setOrigin(0.6, -0.2).setFontSize(12));
    this.texts[1].setFontSize(8);

    this.on('destroy', () => {
      this.leaveSpotAfterDestroy();
      this.scene.game.events.emit(GameEvents.AddScore, 10 + level);
    });
  }

  public leaveSpotAfterDestroy(): void {
    const graphics = this.scene.add.graphics();
    graphics
      .fillStyle(0xe81b1b, 0.5)
      .fillCircle(this.body.x + this.body.width / 2, this.body.y + this.body.height / 2, 20);

    setTimeout(() => graphics.destroy(), 3000);
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
    while (this.timer >= 1000) {
      this.timer -= 1000;
      callback();
    }
  }

  private attackHandler(): void {
    !this.anims.isPlaying && this.anims.play({ key: `${this.atlasName}-attack`, frameRate: this.speed / 3 }, true);
    this.target.getDamage();
    // this.target.disableBody() // maybe does make sense
  }

  private run(): void {
    this.getBody().setVelocity(
      this.target.x > this.x ? this.speed : -this.speed,
      this.target.y > this.y ? this.speed : -this.speed,
    );
    !this.anims.isPlaying && this.anims.play({ key: `${this.atlasName}-move`, frameRate: this.speed / 2 }, true);
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
