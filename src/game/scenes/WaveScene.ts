import { Scene } from 'phaser';
import { Scenes } from './scenes-enum';
import { GameStatus, IMainScene, emitGameStatus, mainDataKey } from './MainScene';
import { timeConfigs } from '../game-events';
import { defaultVolume } from '../classes/config';

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
    this.sound.volume = defaultVolume;
  }

  create() {
    this.initEvents();
    this.runScore();
  }

  runScore() {
    this.scene.run(Scenes.ScoreScene);
    this.scene.bringToTop(Scenes.ScoreScene);
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
    this.mainScene.wave = newWave;
    this.runScore();
    this.scene.sendToBack(Scenes.ImprovementScene);
    this.setDarkness(newWave % 3 === 0);
  }

  improvementScene = () => {
    this.scene.run(Scenes.ImprovementScene, { onNextWave: this.onStartNextWave, [mainDataKey]: this.mainScene });
    this.scene.bringToTop(Scenes.ImprovementScene);
  }

  initEvents() {
    this.game.events.on(emitGameStatus, (s: GameStatus) => {
      if ([GameStatus.Active, GameStatus.Reset].includes(s)) {
        return this.timerWave.paused = false;
      }
      return this.timerWave.paused = true;
    });

    this.timerWave = this.time.addEvent({ delay: timeConfigs.waveDelay, callback: () => {
      this.mainScene.enemiesGroup.clear(true, true);
      this.mainScene.setGameStatus(GameStatus.Improvement);
      this.scene.stop(Scenes.ScoreScene);
      this.improvementScene();
    }, loop: true });
  }
}
