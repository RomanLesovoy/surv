import { Enemy } from '../classes/Enemy';
import { Scenes } from './scenes-enum';
import { getRandomDoorMap } from '../../utils/randomCoordinates';
import { Scene } from 'phaser';
import { IMainScene, mainDataKey } from './MainScene';
import { EImage } from './LoadScene';
import { timeConfigs } from '../game-events';

export default class EnemyScene extends Scene {
  protected mainScene: IMainScene;

  constructor() {
    super(Scenes.EnemyScene);
  }

  init(data: { [mainDataKey]: IMainScene }) {
    this.mainScene = data[mainDataKey];
  }

  create() {
    this.physics.add.collider(this.mainScene.enemiesGroup, this.mainScene.enemiesGroup, this.handleEnemyCollision, null, this);
    this.time.addEvent({ delay: timeConfigs.enemyDelay, callback: () => this.pushEnemy(), loop: true });
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
    const enemy = new Enemy(this, coordinates.x, coordinates.y, EImage.Zombie1, this.mainScene.hero, this.mainScene.wave)
      .setName(`Enemy-${coordinates.x}-${coordinates.y}`)
      .setScale(1);
    return enemy;
  }

  private pushEnemy(): void {
    this.mainScene.enemiesGroup.addMultiple([this.createEnemy(), this.createEnemy()]);
  }
}
