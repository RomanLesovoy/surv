import { Physics } from 'phaser';
import Hero from './Hero';

export enum BonusTypes {
  Health = 'health',
  Armor = 'armor',
  Riffle = 'riffle',
  Shotgun = 'shotgun',
  Ammo = 'ammo',
}

const guns = [BonusTypes.Riffle]; // @TODO add other
const types = [...guns, BonusTypes.Health, BonusTypes.Ammo]; // @TODO add other

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
    this.body.setSize(60, 60);

    const graphics = this.addGraphics();

    const timerEvent = this.scene.time.addEvent({ delay: 100, loop: true, callback: () => {
      this.setAngle(this.angle + 20);
    }});

    this.on('destroy', () => {
      timerEvent.destroy();
      graphics.destroy();
    });
  }

  addGraphics() {
    const glowGraphics = this.scene.add.graphics();

    const glowRadius = 40;
    const glowColor = 0x614198;
    const glowAlpha = 0.2;

    return glowGraphics
      .fillStyle(glowColor, glowAlpha)
      .fillCircle(this.body.x + this.body.width / 2, this.body.y + this.body.height / 2, glowRadius);
  }

  effect(target: Hero): boolean {
    return [

      this.bonusType === BonusTypes.Health && target.hp < 100 && (target.hp <= 50 ? target.hp += 50 : target.hp = 100),

      this.bonusType === BonusTypes.Ammo && target.activeGun && (target.bullets += 150),

      this.bonusType === BonusTypes.Riffle && target.activeGun === BonusTypes.Riffle && (target.bullets += 50),

      [BonusTypes.Riffle, BonusTypes.Shotgun].includes(this.bonusType) && !target.activeGun && target.switchGun(this.bonusType as BonusTypes.Riffle | BonusTypes.Shotgun),

    ].some((b) => !!b)
  }
}
