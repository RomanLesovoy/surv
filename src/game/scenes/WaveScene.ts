import { Scene } from 'phaser';
import { Scenes } from './scenes-enum';
import { GameStatus, IMainScene, emitGameStatus, mainDataKey } from './MainScene';
import config from '../config';

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
    this.sound.volume = config.general.defaultVolume;
  }

  create() {
    this.initEvents();
    this.runScore();
    this.runLightScene();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.timerWave?.destroy();
    });
  }

  runScore() {
    this.scene.run(Scenes.ScoreScene);
    this.scene.bringToTop(Scenes.ScoreScene);
  }

  runLightScene = () => {
    if (this.mainScene.wave % 3 === 0) {
      this.scene.bringToTop(Scenes.LightScene);
      return this.scene.run(Scenes.LightScene);
    }
    return this.scene.stop(Scenes.LightScene);
  }

  onStartNextWave = () => {
    const newWave = this.mainScene.wave + 1;
    this.mainScene.setGameStatus(GameStatus.Active);
    this.mainScene.wave = newWave;
    this.mainScene.hero.hp = this.mainScene.hero.maxHp;
    this.mainScene.waveDelay < config.timeConfigs.maxWaveDelay && (this.mainScene.waveDelay += config.timeConfigs.waveDelayOffset);
    this.runScore();
    this.scene.sendToBack(Scenes.ImprovementScene);
    this.runLightScene();
    this.restartWaveEvent();
    this.mainScene.saveProgress();
  }

  improvementScene = () => {
    this.scene.run(Scenes.ImprovementScene, { onNextWave: this.onStartNextWave, [mainDataKey]: this.mainScene });
    this.scene.bringToTop(Scenes.ImprovementScene);
  }

  initEvents() {
    this.game.events.on(emitGameStatus, (s: GameStatus) => {
      if (s === GameStatus.Active) {
        this.runLightScene();
      }
      if (s === GameStatus.NotStarted) {
        this.timerWave?.destroy();
      }
    });

    this.restartWaveEvent();
  }

  restartWaveEvent = () => {
    this.timerWave = this.time.addEvent({ delay: this.mainScene.waveDelay, callback: () => {
      this.mainScene.enemiesGroup.clear(true, true);
      this.mainScene.bonusGroup.clear(true, true);
      this.mainScene.setGameStatus(GameStatus.Improvement);
      this.improvementScene();
    }});
  }
}
