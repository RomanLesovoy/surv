import { GameObjects, Scene } from 'phaser';
import { EImage } from '../scenes/LoadScene';
import { Text } from './Text';

export const selectedAction = 'selected';

interface IButtonProps {
  callback: (button: GameObjects.Image) => void,
  text: string,
  textureKey: string,
  name: string
}

export type Buttons = Array<{ button: GameObjects.Image, text: GameObjects.Text }>

export default class ButtonGroup {
  public buttons: Buttons;
  private scene: Scene;
  public selectedButtonIndex = 0;
  private arrow: GameObjects.Image;

  constructor (scene: Scene) {
    this.scene = scene;
    this.buttons = [];
  }

  createButton = (buttonProp: IButtonProps, i: number) => {
    const button = this.scene.add.image(
      this.scene.scale.width * 0.5,
      (this.scene.scale.height / 4) / (this.scene.scale.width / this.scene.scale.height),
      buttonProp.textureKey,
    ).setDisplaySize(450, 250);
    button.setY(button.y + i * 300).setName(buttonProp.name);
    const text = new Text(this.scene, button.x, button.y, buttonProp.text).setOrigin(0.5)

    button.on(selectedAction, (available: boolean) => {
      available && buttonProp.callback(button);
    });

    this.buttons.push({ button, text });
    return { button, text }
  }

  setDisableAvailableButton = (name: string, value: boolean) => {
    const button = this.buttons.find((b) => b.button.name === name);
    if (button) {
      !value ? button.button.setTint(0x444444) : button.button.clearTint();
    }
  }

  createArrow() {
    this.arrow = this.scene.add.image(0, 0, EImage.Arrow);
  }

  create(buttons: Array<IButtonProps>) {
    this.createArrow();

    buttons.filter((b) => !!b).forEach(this.createButton);

    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.buttons.forEach((b) => b.button.off(selectedAction));
    });

    this.selectNextButton(0);

    this.scene.input.keyboard.on('keydown-ENTER', () => {
      this.confirmSelection();
    });

    return this.buttons;
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, ) {
		const upJustPressed = Phaser.Input.Keyboard.JustDown(cursors.up!)
		const downJustPressed = Phaser.Input.Keyboard.JustDown(cursors.down!)
		const spaceJustPressed = Phaser.Input.Keyboard.JustDown(cursors.space!);

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

    this.selectedButtonIndex = index;

    this.selectButton();
	}

  confirmSelection() {
    const { button } = this.buttons[this.selectedButtonIndex];
    button.emit(selectedAction, !button.isTinted);
	}

  selectButton() {
    const currentButton = this.buttons[this.selectedButtonIndex];
    
    if (currentButton.button.isTinted) {
      return this.selectNextButton();
    }

    this.arrow.setPosition(currentButton.button.x + 400, currentButton.button.y);
  }
}
