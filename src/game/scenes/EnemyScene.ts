import { Enemy } from '../classes/Enemy';
import { Scenes } from './scenes-enum';
import { getRandomDoorMap } from '../../utils/randomCoordinates';
import { IMainScene, mainDataKey } from './MainScene';
import { EImage } from './LoadScene';
import { timeConfigs } from '../game-events';
import { Scene } from 'phaser';

export default class EnemyScene extends Scene {
  protected mainScene: IMainScene;
  protected mapScene: Scene;

  constructor() {
    super(Scenes.EnemyScene);
  }

  init(data: { [mainDataKey]: IMainScene }) {
    this.mainScene = data[mainDataKey];
    this.mapScene = this.game.scene.getScene(Scenes.MapScene);
  }

  create() {
    this.mapScene.physics.add.collider(this.mainScene.enemiesGroup, this.mainScene.enemiesGroup, this.handleEnemyCollision, null, this.mapScene);
    this.mapScene.time.addEvent({ delay: timeConfigs.enemyDelay, callback: this.pushEnemies, loop: true });
  }

  update(t, d): void {
    this.mainScene.enemiesGroup.children.iterate((e: Enemy) => {
      !e.isDead && e.update(t, d)
      return true;
    });
  }

  private handleEnemyCollision = (enemy1: Enemy, enemy2: Enemy) => {
    const angleBetweenZombies = Phaser.Math.Angle.Between(enemy1.x, enemy1.y, enemy2.x, enemy2.y);
    const avoidanceSpeed = 50;
    this.mapScene.physics.velocityFromAngle(angleBetweenZombies + Math.PI, avoidanceSpeed, enemy1.body.velocity);
    this.mapScene.physics.velocityFromAngle(angleBetweenZombies, avoidanceSpeed, enemy2.body.velocity);
  }

  private createEnemy = (): Enemy => {
    const coordinates = getRandomDoorMap({ width: this.game.scale.width, height: this.game.scale.height });
    const enemy = new Enemy(this.mapScene, coordinates.x, coordinates.y, EImage.Zombie1, this.mainScene.hero, this.mainScene.wave)
      .setName(`Enemy-${coordinates.x}-${coordinates.y}`);
    return enemy;
  }

  private pushEnemies = (): void => {
    const amount = Math.ceil(this.mainScene.wave / timeConfigs.waveEnemyAdd);
    for (let i = 0; i < amount; i++) {
      this.mainScene.enemiesGroup.add(this.createEnemy());
    }
  }
}
