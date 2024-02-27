import { Scene } from 'phaser';
import { Scenes } from './scenes-enum';
import { Text } from '../classes/Text';

export enum EImage {
  PlayerHandgun = 'player-handgun',
  PlayerRiffle = 'player-riffle',
  PlayerFire = 'player-fire',
  PlayerMachineGun = 'player-machine-gun',
  Zombie1 = 'zombie1',
  Zombie1Move = 'a-zombie1-move',
  Zombie1Attack = 'a-zombie1-attack',
  Monster11 = 'monster11',
  Monster11Move = 'monster11-move',
  Monster11Attack = 'monster11-attack',
  Monster11Death = 'monster11-death',
  Monster12 = 'monster12',
  Monster12Move = 'monster12-move',
  Monster12Attack = 'monster12-attack',
  Monster12Death = 'monster12-death',
  Monster21 = 'monster21',
  Monster21Move = 'monster21-move',
  Monster21Attack = 'monster21-attack',
  Monster21Death = 'monster21-death',
  Monster22 = 'monster22',
  Monster22Move = 'monster22-move',
  Monster22Attack = 'monster22-attack',
  Monster22Death = 'monster22-death',
  ShadowBg = 'shadow-bg',
  ButtonBg = 'button-bg',
  Bullet = 'bullet',
  Riffle = 'riffle',
  Ammo = 'ammo',
  MachineGun = 'machine-gun',
  Health = 'health',
  Armor = 'armor',
  Ruby = 'ruby',
  MenuBg = 'menu-bg',
  ImproveBg = 'improve-bg',
  ImproveHeroBg = 'improve-hero-bg',
  BulletAmmo = 'bullet-ammo',
  Arrow = 'arrow',
}

export enum EAudio {
  Pistol = 'pistol',
  Ruby = 'ruby',
  Bonus = 'bonus',
  Death = 'death',
  BonusPick = 'bonus-pick',
  SwitchMenu = 'switch-menu',
  ClickButton = 'click-button',
  HeroRun = 'hero-run',
}

export default class LoadingScene extends Scene {
  constructor(sceme: string = Scenes.LoadingScene) {
    super(sceme);
  }

  preload(): void {
    this.load.baseURL = './assets/v1/';
    this.preloadData();

    // Audio
    this.load.audio(EAudio.Pistol, 'audio/9mm.mp3');
    this.load.audio(EAudio.Ruby, 'audio/ruby.mp3');
    this.load.audio(EAudio.Bonus, 'audio/bonus.mp3');
    this.load.audio(EAudio.BonusPick, 'audio/bonus-pick.mp3');
    this.load.audio(EAudio.Death, 'audio/death.mp3');
    this.load.audio(EAudio.SwitchMenu, 'audio/switch-menu.mp3');
    this.load.audio(EAudio.ClickButton, 'audio/click-button.mp3');
    this.load.audio(EAudio.HeroRun, 'audio/run.mp3');

    // Other
    this.load.image(EImage.Bullet, 'other/m_bullet.png');
    this.load.image(EImage.ButtonBg, 'other/button.png');
    this.load.image(EImage.MenuBg, 'other/menu-bg.jpg');
    this.load.image(EImage.BulletAmmo, 'other/bullet-ammo.png');
    this.load.image(EImage.ImproveBg, 'other/improve-bg.jpg');
    this.load.image(EImage.ImproveHeroBg, 'other/improve-hero-bg.png');
    this.load.image(EImage.Ruby, 'other/ruby_small.png');
    this.load.image(EImage.Arrow, 'other/arrow_small.png');

    // Bonuses
    this.load.image(EImage.Riffle, 'ammo/riffle.png');
    this.load.image(EImage.Armor, 'ammo/armor.png');
    this.load.image(EImage.Health, 'ammo/health.png');
    this.load.image(EImage.Ammo, 'ammo/ammo.png');
    this.load.image(EImage.MachineGun, 'ammo/machine-gun.png');

    // Actors
    this.load.image(EImage.PlayerHandgun, 'player/default.png');
    this.load.image(EImage.PlayerMachineGun, 'player/player-machine-gun.png');
    this.load.image(EImage.PlayerRiffle, 'player/idle-riffle.png');
    this.load.image(EImage.Zombie1, 'enemies/zombie1/idle.png');
    this.load.atlas(EImage.Zombie1Move, 'enemies/zombie1/move.png', 'enemies/zombie1/zombie1-atlas.json');
    this.load.atlas(EImage.Zombie1Attack, 'enemies/zombie1/attack.png', 'enemies/zombie1/zombie1-atlas.json');
    this.load.image(EImage.PlayerFire, 'player/gun-fire_small.png');
    this.load.spritesheet(EImage.Monster11Move, 'enemies/monsters/monster1.1-move.png', { frameWidth: 150, frameHeight: 150 });
    this.load.spritesheet(EImage.Monster11Attack, 'enemies/monsters/monster1.1-attack-1.png', { frameWidth: 225, frameHeight: 225 });
    this.load.spritesheet(EImage.Monster11Death, 'enemies/monsters/monster1.1-death.png', { frameWidth: 225, frameHeight: 150 });
    this.load.spritesheet(EImage.Monster12Move, 'enemies/monsters/monster1.2-move.png', { frameWidth: 150, frameHeight: 150 });
    this.load.spritesheet(EImage.Monster12Attack, 'enemies/monsters/monster1.2-attack-1.png', { frameWidth: 225, frameHeight: 150 });
    this.load.spritesheet(EImage.Monster12Death, 'enemies/monsters/monster1.2-death.png', { frameWidth: 225, frameHeight: 150 });

    this.load.spritesheet(EImage.Monster21Move, 'enemies/monsters/monster2.1-move.png', { frameWidth: 150, frameHeight: 150 });
    this.load.spritesheet(EImage.Monster21Attack, 'enemies/monsters/monster2.1-attack-1.png', { frameWidth: 225, frameHeight: 225 });
    this.load.spritesheet(EImage.Monster21Death, 'enemies/monsters/monster2.1-death.png', { frameWidth: 225, frameHeight: 150 });

    this.load.spritesheet(EImage.Monster22Move, 'enemies/monsters/monster2.2-move.png', { frameWidth: 150, frameHeight: 150 });
    this.load.spritesheet(EImage.Monster22Attack, 'enemies/monsters/monster2.2-attack-1.png', { frameWidth: 150, frameHeight: 150 });
    this.load.spritesheet(EImage.Monster22Death, 'enemies/monsters/monster2.2-death.png', { frameWidth: 225, frameHeight: 150 });

    // Map
    this.load.image('tilesheet', 'map/tile_sheet/metal_100_2.png');
    this.load.tilemapTiledJSON('map', 'map-big-test.json');
  }

  create(): void {
    this.input.setDefaultCursor('url(./assets/v1/other/aim.cur), crosshair');

    this.initAnims();
  }

  preloadData() {
    const { width: x, height: y } = this.game.scale;
    const loadingXPosition = 240;
    const loadingYOffset = 100;
    const loadingWidth = x - loadingXPosition * 2;
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics().fillStyle(0x333333, 0.8).fillRect(loadingXPosition, y / 2 + loadingYOffset, loadingWidth, 50);
    const loadingText = new Text(this, x / 2, y / 2 - 50, 'Loading...').setColor('white').setFontSize(40).setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(loadingXPosition + 10, y / 2 + (loadingYOffset + 10), loadingWidth * value - 20, 30);
    });

    this.load.on('complete', () => {
      setTimeout(() => {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();

        this.scene.start(Scenes.MainScene);
      }, 1000)
    });
  }

  initAnims(): void {
    this.anims.create({
      key: EImage.Zombie1Move,
      frames: this.anims.generateFrameNames(EImage.Zombie1Move, {
        prefix: `zombie1-move-`,
        end: 15,
      }),
      frameRate: 10,
    });

    this.anims.create({
      key: EImage.Zombie1Attack,
      frames: this.anims.generateFrameNames(EImage.Zombie1Attack, {
        prefix: `zombie1-attack-`,
        end: 8,
        start: 0
      }),
      frameRate: 8,
    });

    this.anims.create({
      key: EImage.Monster11Death,
      frames: this.anims.generateFrameNames(EImage.Monster11Death, {
        end: 5,
        start: 0,
      }),
      frameRate: 10,
    });

    this.anims.create({
      key: EImage.Monster11Move,
      frames: this.anims.generateFrameNames(EImage.Monster11Move, {
        end: 8,
        start: 0,
      }),
      frameRate: 8,
    });

    this.anims.create({
      key: EImage.Monster11Attack,
      frames: this.anims.generateFrameNames(EImage.Monster11Attack, {
        end: 5,
        start: 0,
      }),
      frameRate: 6,
    });

    this.anims.create({
      key: EImage.Monster12Death,
      frames: this.anims.generateFrameNames(EImage.Monster12Death, {
        end: 5,
        start: 0,
      }),
      frameRate: 10,
    });

    this.anims.create({
      key: EImage.Monster12Move,
      frames: this.anims.generateFrameNames(EImage.Monster12Move, {
        end: 8,
        start: 0,
      }),
      frameRate: 8,
    });

    this.anims.create({
      key: EImage.Monster12Attack,
      frames: this.anims.generateFrameNames(EImage.Monster12Attack, {
        end: 5,
        start: 0,
      }),
      frameRate: 6,
    });


    this.anims.create({
      key: EImage.Monster21Death,
      frames: this.anims.generateFrameNames(EImage.Monster21Death, {
        end: 8,
        start: 0,
      }),
      frameRate: 10,
    });

    this.anims.create({
      key: EImage.Monster21Move,
      frames: this.anims.generateFrameNames(EImage.Monster21Move, {
        end: 7,
        start: 0,
      }),
      frameRate: 5,
    });

    this.anims.create({
      key: EImage.Monster21Attack,
      frames: this.anims.generateFrameNames(EImage.Monster21Attack, {
        end: 9,
        start: 0,
      }),
      frameRate: 10,
    });


    this.anims.create({
      key: EImage.Monster22Death,
      frames: this.anims.generateFrameNames(EImage.Monster22Death, {
        end: 7,
        start: 0,
      }),
      frameRate: 10,
    });

    this.anims.create({
      key: EImage.Monster22Move,
      frames: this.anims.generateFrameNames(EImage.Monster22Move, {
        end: 7,
        start: 0,
      }),
      frameRate: 5,
    });

    this.anims.create({
      key: EImage.Monster22Attack,
      frames: this.anims.generateFrameNames(EImage.Monster22Attack, {
        end: 6,
        start: 0,
      }),
      frameRate: 3,
    });
  }
}
