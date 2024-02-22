import { Scene } from 'phaser';
import { Scenes } from './scenes-enum';
import { Text } from '../classes/Text';
import { IMainScene, mainDataKey } from './MainScene';

export default class ScoreScene extends Scene {
  protected mainScene: IMainScene;
  protected score: Text;
  protected wave: Text;

  constructor() {
    super(Scenes.ScoreScene);
  }

  init(data: { [mainDataKey]: IMainScene }) {
    this.mainScene = data[mainDataKey];
  }

  get scoreText(): string {
    return `Score: ${this.mainScene.score}`;
  }

  get waveText(): string {
    return `Wave: ${this.mainScene.wave}`;
  }

  create() {
    this.score = new Text(this, 25, 25, this.scoreText).setFontSize(40);
    this.wave = new Text(this, 300, 20, this.waveText).setFontSize(50).setColor('red');
  }

  update(): void {
    this.score.setText(this.scoreText);
    this.wave.setText(this.waveText);
  }
}
