import { Physics } from 'phaser';
import Hero from './Hero';

export enum BonusTypes {
  Health = 'health',
  Armor = 'armor',
  Riffle = 'riffle',
  Shotgun = 'shotgun',
  Ammo = 'ammo',
}

const guns = [BonusTypes.Riffle, BonusTypes.Shotgun];
const types = [...guns, BonusTypes.Health]; // @TODO add other

const textures = {
  [BonusTypes.Riffle]: 'riffle',
  [BonusTypes.Shotgun]: 'shotgun',
  [BonusTypes.Health]: 'health',
  [BonusTypes.Armor]: 'armor',
  [BonusTypes.Ammo]: 'ammo',
}

const generateRandomCoordinatesCenter = (): { x: number, y: number } => {
  return {
    x: 200 + (Math.random() * (window.innerWidth - 400)),
    y: 200 + (Math.random() * (window.innerHeight - 400)),
  }
}

export default class Bonus extends Physics.Arcade.Sprite {
  coordinates: { x: number, y: number };
  bonusType: BonusTypes;

  constructor(scene: Phaser.Scene) {
    const coordinates = generateRandomCoordinatesCenter();
    const bonusType = types[Math.round(Math.random() * (types.length - 1))];
    const texture = textures[bonusType];

    if (!texture) throw 'texture missing';

    super(scene, coordinates.x, coordinates.y, texture);
    this.coordinates = coordinates;
    this.bonusType = bonusType;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setSize(40, 40);

    const timerEvent = this.scene.time.addEvent({ delay: 100, loop: true, callback: () => {
      this.setAngle(this.angle + 20);
    }});

    this.on('destroy', () => {
      timerEvent.destroy();
    });
  }

  effect(target: Hero) {
    this.bonusType === BonusTypes.Health && (target.hp += 50);
    guns.includes(this.bonusType) && (target.activeGun = this.bonusType as BonusTypes.Riffle | BonusTypes.Shotgun);
  }
}
