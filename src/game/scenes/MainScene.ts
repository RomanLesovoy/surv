import { Scene } from 'phaser';
import { Scenes } from './scenes-enum';
import Hero from '../classes/Hero';
import HeroScene from './HeroScene';
import EnemyScene from './EnemyScene';
import Bullet from '../classes/Bullet';

export const mainDataKey = 'mainSceneData';

export default class MainScene extends Scene {
  protected level: number = 1;
  protected enemiesGroup: Phaser.GameObjects.Group;
  protected bulletsGroup: Bullet[];
  protected hero: Hero;

  constructor() {
    super(Scenes.MainScene);
  }
  
  create() {
    this.enemiesGroup = this.physics.add.group({
      key: 'zombiesGroup',
      collideWorldBounds: true,
    });

    this.bulletsGroup = [];

    const sharedThis = { [mainDataKey]: this };

    this.scene.add(Scenes.EnemyScene, EnemyScene, true, sharedThis);
    this.scene.add(Scenes.HeroScene, HeroScene, true, sharedThis);

    this.physics.add.collider(this.bulletsGroup, this.enemiesGroup, (bullet: Bullet, enemy: any) => {
      console.log('collision')
      bullet.destroy();
      enemy.getDamage(15);
    });

    this.time.addEvent({ delay: 20000, callback: () => this.level++, loop: true });
  }
}

export interface IMainScene {
  level: number;
  enemiesGroup: Phaser.GameObjects.Group;
  bulletsGroup: Bullet[];
  hero: Hero;
}
