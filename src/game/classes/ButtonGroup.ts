import { GameObjects, Scene } from 'phaser';
import { EAudio } from '../scenes/LoadScene';
import { Text } from './Text';

export const selectedAction = 'selected';

interface IButtonProps {
  callback: (button: GameObjects.Graphics) => void,
  text: string,
  textureKey: string,
  name: string
}

export type Buttons = Array<{ button: GameObjects.Graphics[], text: GameObjects.Text }>

export default class ButtonGroup {
  public buttons: Buttons;
  private scene: Scene;
  public selectedButtonIndex = 0;
  private switchSound: any;
  private clickSound: any;

  constructor (scene: Scene) {
    this.scene = scene;
    this.buttons = [];
  }

  createButton = (buttonProp: IButtonProps, i: number) => {
    const width = 500;
    const height = 170;
    const x = this.scene.scale.width * 0.5;
    const y = (this.scene.scale.height / 4) / (this.scene.scale.width / this.scene.scale.height);
    const button0 = this.scene.add.graphics().fillStyle(0x111111, 1).setName(buttonProp.name);
    button0.fillRect(x  - width / 2 + 15, y + i * 300 + 15, width - 30, height - 30).setDepth(2);
    const button = this.scene.add.graphics().fillStyle(0x333333, 1).setName(buttonProp.name);
    button.fillRect(x  - width / 2, y + i * 300, width, height);
    const text = new Text(this.scene, x, y + i * 300 + height / 2, buttonProp.text).setOrigin(0.5)

    button.on(selectedAction, (available: boolean) => {
      available && buttonProp.callback(button);
    });

    this.buttons.push({ button: [button, button0], text });
    return { button, text }
  }

  setDisableAvailableButton = (name: string, value: boolean) => {
    const button = this.buttons.find((b) => b.button[0].name === name);
    if (button) {
      button.button[0].setInteractive(value);
      button.button[1].visible = value;
    }
  }

  create(buttons: Array<IButtonProps>) {
    this.switchSound = this.scene.sound.add(EAudio.SwitchMenu);
    this.clickSound = this.scene.sound.add(EAudio.ClickButton);

    buttons.filter((b) => !!b).forEach(this.createButton);

    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.buttons.forEach((b) => b.button[0].off(selectedAction));
    });

    this.selectNextButton(0);

    this.scene.input.keyboard.on('keydown-ENTER', () => {
      this.confirmSelection();
    });

    return this.buttons;
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, ) {
		const upJustPressed = Phaser.Input.Keyboard.JustDown(cursors.up!);
		const downJustPressed = Phaser.Input.Keyboard.JustDown(cursors.down!);

    [
      upJustPressed && this.selectNextButton(-1),
      downJustPressed && this.selectNextButton(1),
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
    button[0].emit(selectedAction, !!button[1].visible);
    this.clickSound.play();
	}

  selectButton() {
    const currentButton = this.buttons[this.selectedButtonIndex];
    
    if (!currentButton.button[1].visible) {
      return this.selectNextButton();
    }

    this.switchSound.play();
  }
}
