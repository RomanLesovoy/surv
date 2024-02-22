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

  setDarkness = (active?: boolean) => {
    if (active) {
      this.scene.bringToTop(Scenes.LightScene);
      return this.scene.run(Scenes.LightScene);
    }
    return this.scene.stop(Scenes.LightScene);
  }

  onStartNextWave = () => {
    const newWave = this.mainScene.wave + 1;
    this.mainScene.setGameStatus(GameStatus.Active);
    this.timerWave.paused = false;
    this.mainScene.wave = newWave;
    this.setDarkness(newWave % 3 === 0);
  }

  improvementScene = () => {
    this.scene.run(Scenes.ImprovementScene, { onNextWave: this.onStartNextWave, [mainDataKey]: this.mainScene });
    this.scene.bringToTop(Scenes.ImprovementScene);
  }

  initEvents() {
    this.timerWave = this.time.addEvent({ delay: timeConfigs.waveDelay, callback: () => {
      this.mainScene.enemiesGroup.children.iterate((e) => {
        e && e.destroy()
        return true;
      });
      this.timerWave.paused = true;
      this.mainScene.setGameStatus(GameStatus.Improvement);
      this.improvementScene();
    }, loop: true });
  }
}
