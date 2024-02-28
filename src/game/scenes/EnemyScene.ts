import { Enemy } from '../classes/Enemy';
import { Scenes } from './scenes-enum';
import { getRandomDoorMap } from '../../utils/randomCoordinates';
import { IMainScene, mainDataKey } from './MainScene';
import { EImage } from './LoadScene';
import { Scene } from 'phaser';
import config, { EnemyType } from '../config';
import Portal from '../classes/Portal';
import { Coords } from '../../utils/types';

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
    const timerZombieEvent = this.mapScene.time.addEvent({ delay: config.timeConfigs.zombieDelay, callback: () => this.pushEnemies(EnemyType.Zombie), loop: true });
    const timerPortalEvent = this.mapScene.time.addEvent({ delay: config.timeConfigs.portalDelay, callback: this.pushPortal, loop: true });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      timerZombieEvent?.destroy();
      timerPortalEvent?.destroy();
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

  private pushPortal = () => {
    if (this.mainScene.wave >= config.general.portalActiveFromWave) {
      const portal = new Portal(this.mapScene, (coords: Coords) => this.pushEnemy(this.createMonsterFn(coords)));
      // const portal = new Portal(this.mapScene, (coords: Coords) => this.pushEnemies(EnemyType.Monster, coords));
      this.pushEnemy(portal);
    }
  }

  private createZombieFn = (coordinates: Coords) => {
    return new Enemy(this.mapScene, coordinates.x, coordinates.y, EImage.Zombie1, this.mainScene.hero, EnemyType.Zombie, this.mainScene.wave) // todo level
      .setName(`Zombie-#${Phaser.Math.RND.between(0, 99999)}`)
  }

  private getRandomMonster = (level: 1 | 2 | 3) => {
    const monsters = {
      [1]: [EImage.Monster11, EImage.Monster12],
      [2]: [EImage.Monster21, EImage.Monster22],
      [3]: [EImage.Monster31],
    }
    return monsters[level][Phaser.Math.RND.between(0, monsters[level].length - 1)];
  }

  private createMonsterFn = (coordinates: Coords) => {
    const wave = this.mainScene.wave;
    const enemyLevel = wave <= 5 ? 1 : Phaser.Math.RND.between(1, wave >= 10 ? 3 : 2);
    const texture = this.getRandomMonster(enemyLevel as 1 | 2 | 3);
    return new Enemy(this.mapScene, coordinates.x, coordinates.y, texture, this.mainScene.hero, EnemyType.Monster, this.mainScene.wave, enemyLevel)
      .setName(`Monster-#${Phaser.Math.RND.between(0, 99999)}`)
  }

  private createEnemy = (enemyType: EnemyType, coords?: Coords): Enemy => {
    const coordinates = coords || getRandomDoorMap({ width: this.game.scale.width, height: this.game.scale.height });
    const enemy = enemyType === EnemyType.Monster ? this.createMonsterFn(coordinates) : this.createZombieFn(coordinates);
    return enemy;
  }

  private pushEnemy = (enemy: Enemy | Portal) => {
    this.mainScene.enemiesGroup.add(enemy);
  }

  private pushEnemies = (type: EnemyType, coords?: Coords): void => {
    // TOO MUCH enemies
    // const amount = Math.ceil(this.mainScene.wave / config.general.waveEnemyAdd);
    // for (let i = 0; i < amount; i++) {
    //   this.pushEnemy(this.createEnemy(type, coords));
    // }
    this.pushEnemy(this.createEnemy(type, coords));
  }
}
