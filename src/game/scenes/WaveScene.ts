import { Scene } from 'phaser';
import { Scenes } from './scenes-enum';
import { GameStatus, IMainScene, mainDataKey } from './MainScene';
import { timeConfigs } from '../game-events';

export default class WaveScene extends Scene {
  protected mainScene: IMainScene;
  protected portalsActive: boolean;
  protected timerWave: Phaser.Time.TimerEvent;

  constructor() {
    super(Scenes.WaveScene);
    this.portalsActive = false;
  }

  init(data: { [mainDataKey]: IMainScene }) {
    this.mainScene = data[mainDataKey];
  }

  create() {
    this.initEvents();
  }

  setDarkness(active?: boolean) {
    if (active) {
      return this.scene.launch(Scenes.LightScene);
    }
    return this.scene.stop(Scenes.LightScene);
  }

  onStartNextWave() {
    this.mainScene.wave++;
    this.setDarkness(this.mainScene.wave % 3 === 0);
  }

  improvementScene() {
    this.scene.launch(Scenes.ImprovementScene);
  }

  initEvents() {
    this.timerWave = this.time.addEvent({ delay: timeConfigs.waveDelay, callback: () => {
      this.timerWave.paused = true;
      this.mainScene.setGameStatus(GameStatus.Improvement);
      this.improvementScene();
    }, loop: true });
  }
}
