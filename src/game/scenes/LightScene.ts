import Phaser, { GameObjects } from 'phaser'
import { Scenes } from './scenes-enum';

export default class LightScene extends Phaser.Scene
{
	maskGraphics: GameObjects.Graphics;
	overlay: GameObjects.Graphics;

	constructor() {
		super(Scenes.LightScene);
	}

	fillCircle(pointer: Phaser.Input.InputPlugin) {
		this.maskGraphics.clear();
		this.maskGraphics.fillStyle(0xffffff);
		this.maskGraphics.fillCircle(pointer.x, pointer.y, this.game.scale.width / 5);
	}

	create() {
		this.overlay = this.add.graphics();

		this.overlay.fillStyle(0x000000, 0.85).fillRect(0, 0, this.game.scale.width, this.game.scale.height);

		this.maskGraphics = this.make.graphics({});

		const mask = new Phaser.Display.Masks.BitmapMask(this, this.maskGraphics);

		mask.invertAlpha = true;

		this.overlay.setMask(mask);

		this.input.on('pointermove', (pointer: Phaser.Input.InputPlugin) => {
			this.fillCircle(pointer);
		});
	}
}
