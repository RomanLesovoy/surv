import { Physics } from 'phaser';
import { EImage } from '../scenes/LoadScene';
import Hero from './Hero';
import config from '../config';

export enum BonusTypes {
  Health = 'health',
  Armor = 'armor',
  Riffle = 'riffle',
  MachineGun = 'machine-gun',
  Ammo = 'ammo',
}

const guns = [BonusTypes.Riffle];
const highLevelGuns = [BonusTypes.MachineGun];
const getTypes = (highLevelBonus: boolean = false) => [
  ...guns,
  BonusTypes.Health,
  BonusTypes.Ammo,
  (highLevelBonus ? highLevelGuns : null),
].filter(b => !!b).flat();

const textures = {
  [BonusTypes.Riffle]: EImage.Riffle,
  [BonusTypes.Health]: EImage.Health,
  [BonusTypes.Armor]: EImage.Armor,
  [BonusTypes.Ammo]: EImage.Ammo,
  [BonusTypes.MachineGun]: EImage.MachineGun,
}

const generateRandomCoordinatesCenter = (mapSize: { width: number, height: number }): { x: number, y: number } => {
  return {
    x: 200 + (Math.random() * (mapSize.width - 400)),
    y: 200 + (Math.random() * (mapSize.height - 400)),
  }
}

export default class Bonus extends Physics.Arcade.Sprite {
  coordinates: { x: number, y: number };
  bonusType: BonusTypes;

  constructor(scene: Phaser.Scene, highLevelBonus: boolean) {
    const coordinates = generateRandomCoordinatesCenter({ height: scene.game.scale.height, width: scene.game.scale.width });
    const types = getTypes(highLevelBonus);
    const bonusType = types[Math.round(Math.random() * (types.length - 1))];
    const texture = textures[bonusType];

    if (!texture) throw 'texture missing';

    super(scene, coordinates.x, coordinates.y, texture);
    this.coordinates = coordinates;
    this.bonusType = bonusType;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.physics.world.enable(this);
    this.body.setSize(60, 60);
    this.setDepth(config.general.defaultBodyDepth);

    const graphics = this.addGraphics();

    const timerEvent = this.scene.time.addEvent({ delay: 120, loop: true, callback: () => {
      this.setAngle(this.angle + 15);
    }});

    this.on(Phaser.Scenes.Events.DESTROY, () => {
      timerEvent?.destroy();
      graphics?.destroy();
    });
  }

  addGraphics() {
    const glowGraphics = this.scene.add.graphics();

    return glowGraphics
      .fillStyle(0x614198, 0.3)
      .setDepth(config.general.defaultBodyDepth)
      .fillCircle(this.body.x + this.body.width / 2, this.body.y + this.body.height / 2, 40);
  }

  effect(target: Hero): number | boolean {
    return [

      this.bonusType === BonusTypes.Health && target.hp < target.maxHp && (target.hp = target.hp + 50 > target.maxHp ? target.maxHp : target.hp + 50),

      this.bonusType === BonusTypes.Ammo && target.activeGun && (target.bullets += 150),

      this.bonusType === BonusTypes.Riffle && target.activeGun === BonusTypes.Riffle && (target.bullets += 50),

      this.bonusType === BonusTypes.MachineGun && target.activeGun === BonusTypes.MachineGun && (target.bullets += 100),

      this.bonusType === BonusTypes.MachineGun && target.activeGun === BonusTypes.Riffle && target.switchGun(this.bonusType),

      [BonusTypes.Riffle, BonusTypes.MachineGun].includes(this.bonusType) && !target.activeGun && target.switchGun(this.bonusType as BonusTypes.Riffle | BonusTypes.MachineGun),

    ].find((b) => !!b)
  }
}
