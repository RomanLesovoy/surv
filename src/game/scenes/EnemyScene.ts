import { Enemy } from '../classes/Enemy';
import { Scenes } from './scenes-enum';
import { getRandomDoorMap } from '../../utils/randomCoordinates';
import { IMainScene, mainDataKey } from './MainScene';
import { EImage } from './LoadScene';
import { Scene } from 'phaser';
import config, { EnemyType } from '../config';

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
    const timerZombieEvent = this.mapScene.time.addEvent({ delay: config.timeConfigs.enemyDelay, callback: () => this.pushEnemies(EnemyType.Zombie), loop: true });
    const timerMonsterEvent = this.mapScene.time.addEvent({ delay: config.timeConfigs.enemyDelay, callback: () => this.pushEnemies(EnemyType.Monster), loop: true });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      timerZombieEvent.destroy();
      timerMonsterEvent.destroy();
    });
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

  private createZombieFn = (coordinates: { x: number, y: number }) => {
    return () => new Enemy(this.mapScene, coordinates.x, coordinates.y, EImage.Zombie1, this.mainScene.hero, EnemyType.Zombie, this.mainScene.wave) // todo level
      .setName(`Zombie-#${Phaser.Math.RND.between(0, 99999)}`)
  }

  private createMonsterFn = (coordinates: { x: number, y: number }) => {
    // Portal
    const wave = this.mainScene.wave;
    const enemyLevel = wave <= 5 ? 1 : Phaser.Math.RND.between(1, wave >= 10 ? 3 : 2);
    const texture = enemyLevel === 3 ? EImage.Monster1 : EImage.Monster1; // todo image
    return () => new Enemy(this.mapScene, coordinates.x, coordinates.y, texture, this.mainScene.hero, EnemyType.Monster, this.mainScene.wave, enemyLevel)
      .setName(`Monster-#${Phaser.Math.RND.between(0, 99999)}`)
  }

  private createEnemy = (enemyType: EnemyType): Enemy => {
    const coordinates = getRandomDoorMap({ width: this.game.scale.width, height: this.game.scale.height });
    const enemy = enemyType === EnemyType.Monster ? this.createMonsterFn(coordinates) : this.createZombieFn(coordinates);
    return enemy();
  }

  private pushEnemies = (type: EnemyType): void => {
    const amount = Math.ceil(this.mainScene.wave / config.general.waveEnemyAdd);
    for (let i = 0; i < amount; i++) {
      this.mainScene.enemiesGroup.add(this.createEnemy(type));
    }
  }
}
