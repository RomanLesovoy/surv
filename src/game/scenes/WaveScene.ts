import { Scene } from 'phaser';
import { Scenes } from './scenes-enum';
import { IMainScene, mainDataKey } from './MainScene';
import LightScene from './LightScene';
import { timeConfigs } from '../game-events';

export default class WaveScene extends Scene {
  protected mainScene: IMainScene;
  protected portalsActive: boolean;
  protected darkness: Phaser.GameObjects.Sprite | null;

  constructor() {
    super(Scenes.WaveScene);
    this.portalsActive = false;
    this.darkness = null;
  }

  init(data: { [mainDataKey]: IMainScene }) {
    this.mainScene = data[mainDataKey];
  }

  create() {
    this.initEvents();
    this.scene.add(Scenes.LightScene, LightScene, false);
  }

  setDarkness(active?: boolean) {
    if (active) {
      return this.scene.launch(Scenes.LightScene);
    }
    return this.scene.stop(Scenes.LightScene);
  }

  initEvents() {
    this.time.addEvent({ delay: timeConfigs.waveDelay, callback: () => {
      this.mainScene.wave++;
      this.setDarkness(this.mainScene.wave % 2 === 0);
    }, loop: true });
  }
}
