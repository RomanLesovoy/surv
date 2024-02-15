import { Scene } from 'phaser';
import { Scenes } from './scenes-enum';

export default class InitScene extends Scene {
  constructor() {
    super(Scenes.InitScene);
  }

  create(): void {
    this.add.tileSprite(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth, window.innerHeight, "bg-block");

    this.scene.start(Scenes.MainScene);

    this.initCamera();
  }

  private initCamera(): void {
    this.cameras.main.setSize(this.game.scale.width, this.game.scale.height);
    this.cameras.main.setZoom(1);
  }
}
