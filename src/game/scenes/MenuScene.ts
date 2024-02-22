import { Scene } from "phaser";
import { EImage } from "./LoadScene";
import { Scenes } from "./scenes-enum";
import { GameStatus, IMainScene, mainDataKey } from './MainScene';
import ButtonGroup, { Buttons } from '../classes/ButtonGroup';

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
	}

  createBg() {
    this.add.image(this.scale.width / 2, this.scale.height / 2 - 20, EImage.MenuBg).setScale(1.1).setTint(0x262525).setAlpha(0.9);
  }

  create() {
    this.createBg();

    this.buttonGroup = new ButtonGroup(this);
    this.buttons = this.buttonGroup.create(
      [
        { text: 'Start', callback: () => this.mainScene.setGameStatus(GameStatus.Reset), textureKey: EImage.ButtonBg },
        { text: 'Resume', callback: () => this.mainScene.setGameStatus(GameStatus.Active), textureKey: EImage.ButtonBg }
      ]
    );

    const changeVisible = (v: boolean) => {
      this.buttons[1].button.setVisible(v);
      this.buttons[1].text.setVisible(v);
    }
    changeVisible(false);

    this.game.events.on(GameStatus.Paused, () => {
      changeVisible(true);
    });

    this.game.events.on(GameStatus.NotStarted, () => {
      changeVisible(false);
    });
  }

  update(): void {
    this.buttonGroup.update(this.cursors);
  }
}
