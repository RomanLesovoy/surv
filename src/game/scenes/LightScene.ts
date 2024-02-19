import Phaser from 'phaser'
import { EImage } from './LoadScene';
import { Scenes } from './scenes-enum';

export default class LightScene extends Phaser.Scene
{
  cover: Phaser.GameObjects.Image;
  light: Phaser.GameObjects.Arc;
  renderTexture: Phaser.GameObjects.RenderTexture;
	constructor()
	{
		super(Scenes.LightScene);

		this.light = null
		this.renderTexture = null
	}

	create()
	{
		const x = 1000
		const y = 1000

		const reveal = this.add.image(x, y, EImage.ShadowBg)
		this.cover = this.add.image(x, y, EImage.ShadowBg).setAlpha(0.95)
		// this.cover.setTint(0x000000)

		const width = this.cover.width
		const height = this.cover.height

		this.renderTexture = this.make.renderTexture({
			width,
			height,
		})

		const maskImage = this.make.image({
			x,
			y,
			key: this.renderTexture.texture.key,
			add: false
		})

		this.cover.mask = new Phaser.Display.Masks.BitmapMask(this, maskImage)
		this.cover.mask.invertAlpha = true

		reveal.mask = new Phaser.Display.Masks.BitmapMask(this, maskImage)

		this.light = this.add.circle(0, 0, 250, 0xffffff, 0.15)
		this.light.visible = false

		this.input.on(Phaser.Input.Events.POINTER_MOVE, this.handlePointerMove, this)

	}

	handlePointerMove(pointer)
	{
		const x = pointer.x - this.cover.x + this.cover.width * 0.5
		const y = pointer.y - this.cover.y + this.cover.height * 0.5

		this.renderTexture.clear()
		this.renderTexture.draw(this.light, x, y)
	}
}
