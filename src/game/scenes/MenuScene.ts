import { Scene } from "phaser";
import { EImage } from "./LoadScene";
import { Scenes } from "./scenes-enum";
import { GameStatus, IMainScene, mainDataKey } from './MainScene';
import ButtonGroup from '../classes/ButtonGroup';
import config from '../config';
import { Text } from "../classes/Text";

export default class MenuScene extends Scene {
  protected mainScene: IMainScene;
  protected cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private buttonGroup: ButtonGroup;

  constructor () {
    super(Scenes.MenuScene);
  }

  init(data: { [mainDataKey]: IMainScene }) {
    this.mainScene = data[mainDataKey];
		this.cursors = this.input.keyboard.createCursorKeys();
    this.sound.volume = config.general.defaultVolume;
	}

  createBg() {
    this.add.image(this.scale.width / 2, this.scale.height / 2 - 20, EImage.MenuBg).setScale(1.1).setTint(0x262525).setAlpha(0.9);
  }

  showScore() {
    if (this.mainScene.hero?.isDead) {
      new Text(this, this.game.scale.width / 2 - 200, 200, `Score: ${this.mainScene.score}`).setFontSize(80).setColor('red');
    }
  }

  create() {
    this.createBg();
    this.showScore();
    const isPaused = this.mainScene.getGameStatus() === GameStatus.Paused;

    this.buttonGroup = new ButtonGroup(this);
    this.buttonGroup.create(
      [
        { text: isPaused ? 'Restart' : 'Start', callback: () => this.mainScene.setGameStatus(GameStatus.Reset), name: 'start', },
        isPaused ? { text: 'Resume', callback: () => this.mainScene.setGameStatus(GameStatus.Active), name: 'resume',  } : null,
      ].filter((b) => !!b)
    );
  }

  update(): void {
    this.buttonGroup.update(this.cursors);
  }
}
