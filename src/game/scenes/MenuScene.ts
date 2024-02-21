import { Scene } from "phaser";
import { EImage } from "./LoadScene";
import { Scenes } from "./scenes-enum";
import { GameStatus, IMainScene, mainDataKey } from './MainScene';

const selectedAction = 'selected';
const buttonHeight = 250;

export default class MenuScene extends Scene {
  protected mainScene: IMainScene;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private buttons: Phaser.GameObjects.Image[] = []
	private selectedButtonIndex = 0

  constructor () {
    super(Scenes.MenuScene);
  }

  init(data: { [mainDataKey]: IMainScene }) {
    this.mainScene = data[mainDataKey];
		this.cursors = this.input.keyboard.createCursorKeys()
	}

  createButton = () => this.add.image(
    this.scale.width * 0.5,
    (this.scale.height / 4) / (this.scale.width / this.scale.height),
    EImage.ButtonBg,
  ).setDisplaySize(450, buttonHeight);

  createPlayButton() {
    const playButton = this.createButton();
    this.add.text(playButton.x, playButton.y, 'Start').setFontSize(40).setOrigin(0.5);

    playButton.on(selectedAction, () => {
      this.mainScene.setGameStatus(GameStatus.Reset);
    });

    return playButton;
  }

  createResumeButton() {
    const resumeButton = this.createButton();
    resumeButton.setY(resumeButton.y + buttonHeight + 100);
    const text = this.add.text(resumeButton.x, resumeButton.y, 'Resume').setFontSize(40).setOrigin(0.5);
    const visible = this.mainScene.getGameStatus() !== GameStatus.NotStarted;

    resumeButton.on(selectedAction, () => {
      this.mainScene.setGameStatus(GameStatus.Active);
    });
    resumeButton.visible = visible;
    text.visible = visible;

    return resumeButton;
  }

  createBg() {
    this.add.image(this.scale.width / 2, this.scale.height / 2, EImage.MenuBg).setTint(0x262525).setAlpha(0.7);
  }

  create() {
    this.createBg();
    const playButton = this.createPlayButton();
    const resumeButton = this.createResumeButton();
    this.buttons.push(playButton, resumeButton);

    this.selectButton(0);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      playButton.off(selectedAction);
      resumeButton.off(selectedAction);
    });

    this.game.events.on(GameStatus.Paused, () => {
      resumeButton.visible = true;
    });

    this.game.events.on(GameStatus.NotStarted, () => {
      resumeButton.visible = false;
    });
  }

  update() {
		const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up!)
		const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down!)
		const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space!);

    [
      upJustPressed && this.selectNextButton(-1),
      downJustPressed && this.selectNextButton(1),
      spaceJustPressed && this.confirmSelection(),
    ].find((_) => _!!);
	}

  selectNextButton(change = 1) {
		let index = this.selectedButtonIndex + change;

    [
      index >= this.buttons.length && (index = 0),
      index < 0 && (index = this.buttons.length - 1),
    ].find((_) => _!!);

    this.selectButton(index);
	}

  confirmSelection() {
    const button = this.buttons[this.selectedButtonIndex];
    button.emit(selectedAction);
	}

  selectButton(index: number) {
    const currentButton = this.buttons[this.selectedButtonIndex]

    // set the current selected button to a white tint
    currentButton.setTint(0xffffff);

    const button = this.buttons[index];

    // set the newly selected button to a green tint
    button.setTint(0x66ff7f);

    // store the new selected index
    this.selectedButtonIndex = index;
  }
}