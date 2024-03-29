import { Scene } from 'phaser';
import { Scenes } from './scenes-enum';
import { IMainScene, mainDataKey } from './MainScene';
import config from '../config';
import { EImage } from './LoadScene';
import ButtonGroup, { Buttons } from '../classes/ButtonGroup';
import { Text } from '../classes/Text';

interface IStartData {
  onNextWave: () => void,
  [mainDataKey]: IMainScene
}
enum StatsKeys {
  Damage = 'damage',
  Hp = 'hp',
  Speed = 'speed',
}
export default class ImprovementScene extends Scene {
  protected mainScene: IMainScene;
  protected improvementsCosts: { speed: number, damage: number, hp: number };
  protected cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  protected stats: Array<Text>;
  private onNextWave: () => void;
  protected buttons: Buttons;
  private buttonGroup: ButtonGroup;

  constructor() {
    super(Scenes.ImprovementScene);
    this.buttons = [];
  }

  init(data: IStartData) {
    this.mainScene = data[mainDataKey];
    this.cursors = this.input.keyboard.createCursorKeys();
    this.onNextWave = data.onNextWave;
  }

  createBg() {
    this.add.image(this.scale.width / 2, this.scale.height / 2 - 20, EImage.ImproveBg)
      .setDisplaySize(this.game.scale.width, this.game.scale.height * 1.5)
      .setAlpha(0.95);
    this.add.image(500, this.game.scale.height - 500, EImage.ImproveHeroBg);
  }

  onImproveSpeed = () => {
    if(this.checkEnoughRuby(this.improvementsCosts[StatsKeys.Speed])) {
      this.mainScene.hero.speed += config.defaultHeroStats.speedStatIncrease;
      this.mainScene.ruby -= this.improvementsCosts[StatsKeys.Speed];
      this.setCosts();
      this.updateButtons();
    }
  }

  onImproveDamage = () => {
    if(this.checkEnoughRuby(this.improvementsCosts[StatsKeys.Damage])) {
      this.mainScene.hero.damage += config.defaultHeroStats.damageStatIncrease;
      this.mainScene.ruby -= this.improvementsCosts[StatsKeys.Damage];
      this.setCosts();
      this.updateButtons();
    }
  }

  onImproveHp = () => {
    if(this.checkEnoughRuby(this.improvementsCosts[StatsKeys.Hp])) {
      this.mainScene.hero.maxHp += config.defaultHeroStats.hpStatIncrease;
      this.mainScene.hero.hp = this.mainScene.hero.maxHp;
      this.mainScene.ruby -= this.improvementsCosts[StatsKeys.Hp];
      this.setCosts();
      this.updateButtons();
    }
  }

  createHeroStats() {
    this.stats = [
      new Text(this, 120, 100, ''),
      new Text(this, 120, 180, ''),
      new Text(this, 120, 260, ''),
      new Text(this, 120, 330, '').setFontSize(60).setColor('red'),
    ];
  }

  updateHeroStats() {
    const { hero, ruby } = this.mainScene;
    this.stats[0].setText(`Health: ${hero.hp}`);
    this.stats[1].setText(`Damage: ${hero.damage}`);
    this.stats[2].setText(`Speed: ${hero.speed}`);
    this.stats[3].setText(`Ruby: ${ruby}`);
  }

  setCosts() {
    this.improvementsCosts = {
      [StatsKeys.Speed]: Math.round(this.mainScene.hero.speed / config.defaultHeroStats.speedStatIncrease),
      [StatsKeys.Damage]: Math.round(this.mainScene.hero.damage / config.defaultHeroStats.damageStatIncrease),
      [StatsKeys.Hp]: Math.round(this.mainScene.hero.maxHp / config.defaultHeroStats.hpStatIncrease),
    }
  }

  checkEnoughRuby = (costs: number) => costs <= this.mainScene.ruby;

  create () {
    this.createBg();
    this.createHeroStats();
    this.setCosts();
    this.buttonGroup = new ButtonGroup(this);
    this.buttonGroup.create([
      { text: 'Speed ++', callback: this.onImproveSpeed, name: StatsKeys.Speed, },
      { text: 'Health ++', callback: this.onImproveHp, name: StatsKeys.Hp, },
      { text: 'Damage ++', callback: this.onImproveDamage, name: StatsKeys.Damage, },
      { text: 'ok', callback: () => { this.onNextWave(); this.scene.stop() }, name: 'ok', },
    ]);
    this.updateButtons();
  }

  updateButtons() {
    this.buttonGroup.buttons
      .forEach((b) => {
        if (b.button[0].name !== 'ok') {
          this.buttonGroup.setDisableAvailableButton(b.button[0].name, this.checkEnoughRuby(this.improvementsCosts[b.button[0].name]))
        }
      })
  }

  update(): void {
    this.buttonGroup.update(this.cursors);
    this.updateHeroStats();
  }
}
