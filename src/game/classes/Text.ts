import { GameObjects, Scene } from 'phaser';

export class Text extends GameObjects.Text {
  constructor(scene: Scene, x: number, y: number, text: string) {
    super(scene, x, y, text.toUpperCase(), {
      fontSize: 40,
      color: '#fff',
      fontFamily: '"GAME"',
      stroke: '#000',
      strokeThickness: 4,
      fontStyle: 'bold',
    });

    this.setOrigin(0, 0);

    scene.add.existing(this);
  }
}
