import { Scene } from 'phaser';
import { Scenes } from './scenes-enum';
import { IMainScene, mainDataKey } from './MainScene';
// import LightScene from './LightScene';

export default class WaveScene extends Scene {
  protected mainScene: IMainScene;
  protected currentWave: number;
  protected unitsLevel: number;
  protected portalsActive: boolean;
  protected darkness: Phaser.GameObjects.Sprite | null;

  constructor() {
    super(Scenes.WaveScene);
    this.currentWave = 1;
    this.unitsLevel = 1;
    this.portalsActive = false;
    this.darkness = null;
  }

  init(data: { [mainDataKey]: IMainScene }) {
    this.mainScene = data[mainDataKey];
  }

  create() {
    this.initEvents();
    this.setDarkness();

    setTimeout(() => this.setDarkness(true) as unknown as Phaser.GameObjects.Sprite, 2000)

    this.events.on('resume', () => this.setDarkness);
  }

  setDarkness(active?: boolean) {
    if (!!active ? active : !!this.darkness) {
      // this.scene.add(Scenes.LightScene, LightScene, true);
    } else {
      this.darkness = null;
      this.scene.stop(Scenes.LightScene);
    }
  }

  initEvents() {
    this.time.addEvent({ delay: 20000, callback: () => {
      this.mainScene.unitsLevel++;
    }, loop: true });
  }
}
