import { GameObjects, Scene } from 'phaser';

export class Text extends GameObjects.Text {
  constructor(scene: Scene, x: number, y: number, text: string) {
    super(scene, x, y, text.toUpperCase(), {
      fontSize: '40px',
      color: '#fff',
      fontFamily: 'Airborne',
      // fontFamily: '"Jennie on the Block"',
      stroke: '#000',
      strokeThickness: 4,
      fontStyle: 'bold',
    });

    this.setOrigin(0, 0).setDepth(5);

    scene.add.existing(this);
  }
}
