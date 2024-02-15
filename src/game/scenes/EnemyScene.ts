import { Enemy } from '../classes/Enemy';
import { Scenes } from './scenes-enum';
import { getRandomCoordinates } from '../../utils/randomCoordinates';
import { Scene } from 'phaser';
import { IMainScene, mainDataKey } from './MainScene';

export default class EnemyScene extends Scene {
  protected timerSpawn!: number;
  protected mainScene: IMainScene;

  constructor() {
    super(Scenes.EnemyScene);
    this.timerSpawn = 2000;
  }

  init(data) {
    this.mainScene = data[mainDataKey];
  }

  create() {
    console.log(2)
    this.physics.add.collider(this.mainScene.enemiesGroup, this.mainScene.enemiesGroup, this.handleEnemyCollision, null, this);
    this.time.addEvent({ delay: this.timerSpawn, callback: () => this.pushEnemy(), loop: true });
  }

  update(t, d): void {
    this.mainScene.enemiesGroup.children.iterate((e: Enemy) => {
      !e.isDead && e.update(t, d)
      return true;
    });
    super.update(t, d);
  }

  private handleEnemyCollision(enemy1: Enemy, enemy2: Enemy) {
    console.log('enemy collision')
    const angleBetweenZombies = Phaser.Math.Angle.Between(enemy1.x, enemy1.y, enemy2.x, enemy2.y);
    const avoidanceSpeed = 50;
    this.physics.velocityFromAngle(angleBetweenZombies + Math.PI, avoidanceSpeed, enemy1.body.velocity);
    this.physics.velocityFromAngle(angleBetweenZombies, avoidanceSpeed, enemy2.body.velocity);
  }

  private createEnemy(): Enemy {
    const coordinates = getRandomCoordinates();
    const enemy = new Enemy(this, coordinates.x, coordinates.y, 'zombie1', this.mainScene.hero, this.mainScene.level)
      .setName(`Enemy-${coordinates.x}-${coordinates.y}`)
      .setScale(1);
    return enemy;
  }

  private pushEnemy(): void {
    const enemy = this.createEnemy();
    this.mainScene.enemiesGroup.add(enemy);
  }
}
