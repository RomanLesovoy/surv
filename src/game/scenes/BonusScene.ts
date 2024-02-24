import { IMainScene, mainDataKey } from "./MainScene";
import { Scenes } from "./scenes-enum";
import Bonus from "../classes/Bonus";
import Hero from "../classes/Hero";
import { GameEvents, timeConfigs } from '../game-events';
import { EImage } from './LoadScene';
import { Scene } from 'phaser';

export default class BonusScene extends Scene {
  protected mainScene: IMainScene;
  protected mapScene: Scene;

  constructor() {
    super(Scenes.BonusScene);
  }
  
  init(data: { [mainDataKey]: IMainScene }) {
    this.mainScene = data[mainDataKey];
    this.mapScene = this.game.scene.getScene(Scenes.MapScene);
  }

  create() {
    this.mapScene.time.addEvent({ delay: timeConfigs.bonusDelay, callback: () => {
      const bonus = new Bonus(this.mapScene);
      this.mapScene.physics.world.enable(bonus);
      this.mapScene.physics.add.overlap(bonus, this.mainScene.hero, (b: Bonus, h: Hero) => {
        b.effect(h) && b.destroy();
      });
    }, loop: true });

    this.game.events.on(GameEvents.CreateRuby, this.leaveRubyAfterEnemyDestroy);
  }

  protected leaveRubyAfterEnemyDestroy = (x, y): void => {
    const ruby = this.add.image(x + 20, y + 20, EImage.Ruby).setSize(30, 30);

    const graphics = this.add.graphics()
      .fillStyle(0x614198, 0.5)
      .fillCircle(ruby.x, ruby.y, 25);

    this.mapScene.physics.world.enable(ruby);
    this.mapScene.physics.add.overlap(ruby, this.mainScene.hero, () => {
      ruby.destroy();
      graphics.destroy();
      this.mainScene.ruby++;
    });
  }
}
