import { Scene } from 'phaser';
import { Scenes } from './scenes-enum';

export default class ImprovementScene extends Scene {
  constructor() {
    super(Scenes.ImprovementScene);
  }

  create () {
    console.log(1)
  }
}
