import { Scene } from 'phaser';
import { Scenes } from './scenes-enum';
import { IMainScene, mainDataKey } from './MainScene';
import { defaultHeroStats } from '../classes/config';
import { EImage } from './LoadScene';
import ButtonGroup, { Buttons } from '../classes/ButtonGroup';
import { Text } from '../classes/Text';

interface IStartData {
  onNextWave: () => void,
  [mainDataKey]: IMainScene
}
export default class ImprovementScene extends Scene {
  protected mainScene: IMainScene;
  protected improvementsCosts: { speed: number, damage: number, hp: number };
  protected cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  protected stats: Array<Text>;
  private onNextWave: () => void;
  private buttons: Buttons;
  private buttonGroup: ButtonGroup;

  constructor() {
    super(Scenes.ImprovementScene);
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

  onImproveSpeed() {
    this.mainScene.hero.speed += defaultHeroStats.speedStatIncrease;
  }

  onImproveDamage() {
    this.mainScene.hero.damage += defaultHeroStats.damageStatIncrease;
  }

  onImproveHp() {
    this.mainScene.hero.hp += defaultHeroStats.hpStatIncrease;
  }

  renderHeroStats() {
    const { hero } = this.mainScene;
    this.stats = [
      new Text(this, 120, 100, `Health: ${hero.hp}`).setFontSize(40),
      new Text(this, 120, 180, `Damage: ${hero.damage}`).setFontSize(40),
      new Text(this, 120, 260, `Speed: ${hero.speed}`).setFontSize(40),
    ];
  }

  create () {
    this.createBg();

    this.renderHeroStats();

    this.improvementsCosts = {
      speed: Math.round(this.mainScene.hero.speed / defaultHeroStats.speedStatIncrease),
      damage: Math.round(this.mainScene.hero.damage / defaultHeroStats.damageStatIncrease),
      hp: Math.round(this.mainScene.hero.hp / defaultHeroStats.hpStatIncrease),
    }

    this.buttonGroup = new ButtonGroup(this);
    this.buttons = this.buttonGroup.create([
      { text: 'Speed ++', callback: this.onImproveSpeed, textureKey: EImage.ButtonBg },
      { text: 'Health ++', callback: this.onImproveHp, textureKey: EImage.ButtonBg },
      { text: 'Damage ++', callback: this.onImproveDamage, textureKey: EImage.ButtonBg },
      { text: 'ok', callback: this.onNextWave, textureKey: EImage.ButtonBg },
    ]);
    console.log(this.buttons)
  }

  update(): void {
    this.buttonGroup.update(this.cursors);
  }
}
