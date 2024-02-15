import Hero from '../classes/Hero';
import { Scenes } from './scenes-enum';
import { Scene } from 'phaser';
import { IMainScene, mainDataKey } from './MainScene';
import { Enemy } from '../classes/Enemy';
import Bullet from '../classes/Bullet';

export default class HeroScene extends Scene {
  protected mainScene: IMainScene;

  constructor() {
    super(Scenes.HeroScene);
  }
  
  init(data) {
    this.mainScene = data[mainDataKey];
  }

  create() {
    this.initHero();
  }

  update(t, d): void {
    this.mainScene.hero?.active && this.mainScene.hero.update(t, d);
  }

  onShot = (bullet: Bullet) => {
    this.mainScene.enemiesGroup.children.iterate((e) => {
      this.physics.add.overlap(bullet, e, (bullet: Bullet, enemy: Enemy) => {
        bullet.destroy();
        enemy.getDamage(15);
      });
      return true;
    })
  }

  private initHero(): void {
    this.mainScene.hero = new Hero(this, window.innerWidth / 2, window.innerHeight / 2, 'player', this.onShot);
  }
}
