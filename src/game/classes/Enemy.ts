import { Scene, Math } from 'phaser';
import { Actor } from './Actor';
import Hero from './Hero';
import { Text } from './Text';

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

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.getBody().setOffset(0, 15);
    this.texts.push(new Text(scene, x, y, `Level ${level}`).setOrigin(0.6, -0.2).setFontSize(12));
    this.texts[1].setFontSize(8);

    this.on('destroy', () => {
      this.scene.game.events.emit('score', 10 + level)
    });
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
    !this.anims.isPlaying && this.anims.play(`${this.atlasName}-attack`, true);
    this.target.getDamage();
    // this.target.disableBody() // maybe does make sense
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
      this.getBody().setVelocity(
        this.target.x > this.x ? this.speed : -this.speed,
        this.target.y > this.y ? this.speed : -this.speed,
      );
      !this.anims.isPlaying && this.anims.play(`${this.atlasName}-move`, true);
    }
    this.updateAngle(this.target, this);
  }
}
