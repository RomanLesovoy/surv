import { Scene } from "phaser";
import { EImage } from "./LoadScene";
import { Scenes } from "./scenes-enum";
import { GameStatus, IMainScene, mainDataKey } from './MainScene';
import ButtonGroup, { Buttons } from '../classes/ButtonGroup';
import config from '../config';
import { Text } from "../classes/Text";

export default class MenuScene extends Scene {
  protected mainScene: IMainScene;
  protected cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private buttons: Buttons;
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

    this.buttonGroup = new ButtonGroup(this);
    this.buttons = this.buttonGroup.create(
      [
        { text: 'Start', callback: () => this.mainScene.setGameStatus(GameStatus.Reset), name: 'start', textureKey: EImage.ButtonBg },
        { text: 'Resume', callback: () => this.mainScene.setGameStatus(GameStatus.Active), name: 'resume', textureKey: EImage.ButtonBg }
      ]
    );

    const changeVisible = (v: boolean) => {
      this.buttons[1].button.setVisible(v);
      this.buttons[1].text.setVisible(v);
      this.buttons[0].text.setText(v ? 'Restart' : 'Start');
    }
    changeVisible(this.mainScene.getGameStatus() === GameStatus.Paused);
  }

  update(): void {
    this.buttonGroup.update(this.cursors);
  }
}
