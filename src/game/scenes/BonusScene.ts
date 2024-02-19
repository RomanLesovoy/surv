import { IMainScene, mainDataKey } from "./MainScene";
import { Scenes } from "./scenes-enum";
import Bonus from "../classes/Bonus";
import Hero from "../classes/Hero";

export default class BonusScene extends Phaser.Scene {
  protected mainScene: IMainScene;

  constructor() {
    super(Scenes.BonusScene);
  }
  
  init(data: { [mainDataKey]: IMainScene }) {
    this.mainScene = data[mainDataKey];
  }

  create() {
    this.time.addEvent({ delay: 10000, callback: () => {
      const bonus = new Bonus(this);
      this.physics.world.enable(bonus);
      this.physics.add.overlap(bonus, this.mainScene.hero, (b: Bonus, h: Hero) => {
        b.effect(h) && b.destroy();
      });
    }, loop: true });
  }
}
