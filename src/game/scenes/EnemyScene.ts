import { Enemy } from '../classes/Enemy';
import { Scenes } from './scenes-enum';
import { getRandomDoorMap } from '../../utils/randomCoordinates';
import { Scene } from 'phaser';
import { IMainScene, mainDataKey } from './MainScene';
import { EImage } from './LoadScene';

export default class EnemyScene extends Scene {
  protected timerSpawn!: number;
  protected mainScene: IMainScene;

  constructor() {
    super(Scenes.EnemyScene);
    this.timerSpawn = 2000;
  }

  init(data: { [mainDataKey]: IMainScene }) {
    this.mainScene = data[mainDataKey];
  }

  create() {
    this.physics.add.collider(this.mainScene.enemiesGroup, this.mainScene.enemiesGroup, this.handleEnemyCollision, null, this);
    this.time.addEvent({ delay: this.timerSpawn, callback: () => this.pushEnemy(), loop: true });
  }

  update(t, d): void {
    this.mainScene.enemiesGroup.children.iterate((e: Enemy) => {
      !e.isDead && e.update(t, d)
      return true;
    });
  }

  private handleEnemyCollision(enemy1: Enemy, enemy2: Enemy) {
    const angleBetweenZombies = Phaser.Math.Angle.Between(enemy1.x, enemy1.y, enemy2.x, enemy2.y);
    const avoidanceSpeed = 50;
    this.physics.velocityFromAngle(angleBetweenZombies + Math.PI, avoidanceSpeed, enemy1.body.velocity);
    this.physics.velocityFromAngle(angleBetweenZombies, avoidanceSpeed, enemy2.body.velocity);
  }

  private createEnemy(): Enemy {
    const coordinates = getRandomDoorMap({ width: this.game.scale.width, height: this.game.scale.height });
    const enemy = new Enemy(this, coordinates.x, coordinates.y, EImage.Zombie1, this.mainScene.hero, this.mainScene.unitsLevel)
      .setName(`Enemy-${coordinates.x}-${coordinates.y}`)
      .setScale(1);
    return enemy;
  }

  private pushEnemy(): void {
    const enemy = this.createEnemy();
    this.mainScene.enemiesGroup.add(enemy);
  }
}
