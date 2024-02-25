import { IMainScene, mainDataKey } from "./MainScene";
import { Scenes } from "./scenes-enum";
import Bonus from "../classes/Bonus";
import Hero from "../classes/Hero";
import { GameEvents, timeConfigs } from '../game-events';
import { EAudio, EImage } from './LoadScene';
import { Scene } from 'phaser';
import { defaultBodyDepth } from '../classes/config';

export default class BonusScene extends Scene {
  protected mainScene: IMainScene;
  private bonusSound: any;
  private bonusPickSound: any;
  private rubySound: any;
  protected mapScene: Scene;

  constructor() {
    super(Scenes.BonusScene);
  }
  
  init(data: { [mainDataKey]: IMainScene }) {
    this.mainScene = data[mainDataKey];
    this.mapScene = this.game.scene.getScene(Scenes.MapScene);
  }

  create() {
    this.rubySound = this.sound.add(EAudio.Ruby);
    this.bonusSound = this.sound.add(EAudio.Bonus);
    this.bonusPickSound = this.sound.add(EAudio.BonusPick);

    this.mapScene.time.addEvent({ delay: timeConfigs.bonusDelay, callback: () => {
      const bonus = new Bonus(this.mapScene);
      this.bonusSound.play();
      this.mapScene.physics.world.enable(bonus);
      this.mapScene.physics.add.overlap(bonus, this.mainScene.hero, (b: Bonus, h: Hero) => {
        b.effect(h) && this.bonusPickSound.play() && b.destroy();
      });
    }, loop: true });

    this.game.events.on(GameEvents.CreateRuby, this.leaveRubyAfterEnemyDestroy);
  }

  protected leaveRubyAfterEnemyDestroy = (x, y): void => {
    const ruby = this.mapScene.add.image(x + 20, y + 20, EImage.Ruby).setSize(30, 30).setDepth(defaultBodyDepth);

    const graphics = this.mapScene.add.graphics()
      .fillStyle(0x614198, 0.5)
      .fillCircle(ruby.x, ruby.y, 25)
      .setDepth(defaultBodyDepth);

    this.mapScene.physics.world.enable(ruby);
    this.mapScene.physics.add.overlap(ruby, this.mainScene.hero, () => {
      this.rubySound.play();
      ruby.destroy();
      graphics.destroy();
      this.mainScene.ruby++;
    });
  }
}
