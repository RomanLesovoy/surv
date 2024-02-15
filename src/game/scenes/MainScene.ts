import { Scene } from 'phaser';
import { Scenes } from './scenes-enum';
import Hero from '../classes/Hero';
import HeroScene from './HeroScene';
import EnemyScene from './EnemyScene';
import ScoreScene from './ScoreScene';
import { GameEvents } from '../game-events';
import Bonus from '../classes/Bonus';

export const mainDataKey = 'mainSceneData';

export default class MainScene extends Scene {
  protected level: number = 1;
  protected enemiesGroup: Phaser.GameObjects.Group;
  protected score: number;
  protected hero: Hero;

  constructor() {
    super(Scenes.MainScene);
    this.score = 0;
  }

  initView() {
    this.cameras.main.setSize(this.game.scale.width, this.game.scale.height);
    this.cameras.main.setZoom(1.1);
  }
  
  create() {
    this.add.tileSprite(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth, window.innerHeight, "bg-block");

    this.enemiesGroup = this.physics.add.group({
      key: 'zombiesGroup',
      collideWorldBounds: true,
    });

    this.initView();

    const sharedThis = { [mainDataKey]: this };

    this.scene.add(Scenes.EnemyScene, EnemyScene, true, sharedThis);
    this.scene.add(Scenes.HeroScene, HeroScene, true, sharedThis);
    this.scene.add(Scenes.ScoreScene, ScoreScene, true, sharedThis);

    this.initEvents();
  }

  initEvents() {
    this.game.events.on(GameEvents.AddScore, (score: number) => {
      this.score += score;
    });

    this.time.addEvent({ delay: 20000, callback: () => {
      this.level++;
      const bonus = new Bonus(this);
      this.physics.add.overlap(bonus, this.hero, (b: Bonus, h: Hero) => {
        b.effect(h) && b.destroy();
      });
    }, loop: true });
  }
}

export interface IMainScene {
  level: number;
  enemiesGroup: Phaser.GameObjects.Group;
  hero: Hero;
  score: number;
}
