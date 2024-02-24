import Hero from '../classes/Hero';
import { Scenes } from './scenes-enum';
import { Scene, Tilemaps } from 'phaser';
import { IMainScene, mainDataKey } from './MainScene';
import { Enemy } from '../classes/Enemy';
import Bullet from '../classes/Bullet';

export default class HeroScene extends Scene {
  protected mainScene: IMainScene;
  protected mapScene: Scene;

  constructor() {
    super(Scenes.HeroScene);
  }
  
  init(data: { [mainDataKey]: IMainScene }) {
    this.mainScene = data[mainDataKey];
    this.mapScene = this.game.scene.getScene(Scenes.MapScene);
  }

  create() {
    this.initHero();
  }

  update(t, d): void {
    this.mainScene.hero?.active && !this.mainScene.hero.isDead && this.mainScene.hero.update(t, d);
  }

  onShot = (bullet: Bullet) => {
    this.mainScene.enemiesGroup.children.iterate((e) => {
      this.mapScene.physics.add.overlap(bullet, e, (bullet: Bullet, enemy: Enemy) => {
        enemy?.animateDamage && enemy.animateDamage(bullet);
        enemy?.getDamage && enemy.getDamage(this.mainScene.hero.damage);
        bullet?.destroy();
      });
      
      const wallLayer = this.mainScene.map.getLayer('walls');
      // TODO MAYBE RE-WORK
      // @ts-ignore 
      this.mapScene.physics.add.overlap(bullet, wallLayer.tilemapLayer, (a: Bullet, b: Tilemaps.Tile) => {
        b.index === 2 ? bullet?.destroy() : null;
      })
      return true;
    });
  }

  private initHero(): void {
    this.mainScene.hero = new Hero(this.mapScene, this.game.scale.width / 2, this.game.scale.height / 2, this.onShot).setName('Player').setDepth(5);
  }
}
