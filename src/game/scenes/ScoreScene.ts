import { Scenes } from './scenes-enum';
import { Text } from '../classes/Text';
import { IMainScene, mainDataKey } from './MainScene';
import { Scene } from 'phaser';
import { timeConfigs } from '../game-events';

export default class ScoreScene extends Scene {
  protected mainScene: IMainScene;
  protected score: Text;
  protected wave: Text;
  protected waveTimeText: Text | null;
  protected waveTime: number;
  protected mapScene: Scene;

  constructor() {
    super(Scenes.ScoreScene);
  }

  init(data: { [mainDataKey]: IMainScene }) {
    this.mainScene = data[mainDataKey];
    this.mapScene = this.game.scene.getScene(Scenes.MapScene);
  }

  get scoreText(): string {
    return `Score: ${this.mainScene.score}`;
  }

  get waveText(): string {
    return `Wave: ${this.mainScene.wave}`;
  }

  get waveDelaySec(): number {
    return timeConfigs.waveDelay / 1000;
  }

  getWaveTimeText(): string {
    return `Time left: ${this.waveTime}`;
  }

  create() {
    this.score = new Text(this, 25, 25, this.scoreText).setFontSize(40);
    this.wave = new Text(this, 300, 20, this.waveText).setFontSize(50).setColor('red');
    this.waveTime = this.waveDelaySec;
    this.waveTimeText = new Text(this, this.game.scale.width - 400, 20, this.getWaveTimeText()).setFontSize(50);

    this.time.addEvent({ delay: 1000, callback: () => {
      this.waveTime--;
      this.waveTimeText.setText(this.getWaveTimeText());
    }, loop: true });
  }

  update(): void {
    this.score.setText(this.scoreText);
    this.wave.setText(this.waveText);
  }
}
