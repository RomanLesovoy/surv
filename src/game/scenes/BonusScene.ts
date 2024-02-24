import { IMainScene, mainDataKey } from "./MainScene";
import { Scenes } from "./scenes-enum";
import Bonus from "../classes/Bonus";
import Hero from "../classes/Hero";
import { GameEvents, timeConfigs } from '../game-events';
import { EAudio, EImage } from './LoadScene';

export default class BonusScene extends Phaser.Scene {
  protected mainScene: IMainScene;
  private bonusSound: any;
  private bonusPickSound: any;
  private rubySound: any;

  constructor() {
    super(Scenes.BonusScene);
  }
  
  init(data: { [mainDataKey]: IMainScene }) {
    this.mainScene = data[mainDataKey];
  }

  create() {
    this.rubySound = this.sound.add(EAudio.Ruby);
    this.bonusSound = this.sound.add(EAudio.Bonus);
    this.bonusPickSound = this.sound.add(EAudio.BonusPick);

    this.time.addEvent({ delay: timeConfigs.bonusDelay, callback: () => {
      const bonus = new Bonus(this);
      this.physics.world.enable(bonus);
      this.bonusSound.play();
      this.physics.add.overlap(bonus, this.mainScene.hero, (b: Bonus, h: Hero) => {
        this.bonusPickSound.play();
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

    this.physics.world.enable(ruby);
    this.physics.add.overlap(ruby, this.mainScene.hero, () => {
      this.rubySound.play();
      ruby.destroy();
      graphics.destroy();
      this.mainScene.ruby++;
    });
  }
}
