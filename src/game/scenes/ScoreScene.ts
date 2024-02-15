import { Scene } from 'phaser';
import { Scenes } from './scenes-enum';
import { Text } from '../classes/Text';
import { IMainScene, mainDataKey } from './MainScene';

export default class ScoreScene extends Scene {
  protected mainScene: IMainScene;
  protected score: Text;

  constructor() {
    super(Scenes.ScoreScene);
  }

  init(data: { [mainDataKey]: IMainScene }) {
    this.mainScene = data[mainDataKey];
  }

  get scoreText(): string {
    return `Score: ${this.mainScene.score}`;
  }

  create() {
    this.score = new Text(this, 25, 25, this.scoreText).setFontSize(30);
  }

  update(): void {
    this.score.setText(this.scoreText)
  }
}
