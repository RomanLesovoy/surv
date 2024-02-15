import { Scene } from 'phaser';
import { Scenes } from './scenes-enum';
import Hero from '../classes/Hero';
import HeroScene from './HeroScene';
import EnemyScene from './EnemyScene';

export const mainDataKey = 'mainSceneData';

export default class MainScene extends Scene {
  protected level: number = 1;
  protected enemiesGroup: Phaser.GameObjects.Group;
  protected hero: Hero;

  constructor() {
    super(Scenes.MainScene);
  }
  
  create() {
    this.enemiesGroup = this.physics.add.group({
      key: 'zombiesGroup',
      collideWorldBounds: true,
    });

    const sharedThis = { [mainDataKey]: this };

    this.scene.add(Scenes.EnemyScene, EnemyScene, true, sharedThis);
    this.scene.add(Scenes.HeroScene, HeroScene, true, sharedThis);

    this.time.addEvent({ delay: 20000, callback: () => this.level++, loop: true });
  }
}

export interface IMainScene {
  level: number;
  enemiesGroup: Phaser.GameObjects.Group;
  hero: Hero;
}
