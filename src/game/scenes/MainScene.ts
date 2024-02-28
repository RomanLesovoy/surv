import { Scene, Tilemaps } from 'phaser';
import { Scenes } from './scenes-enum';
import Hero from '../classes/Hero';
import HeroScene from './HeroScene';
import EnemyScene from './EnemyScene';
import config, { GameEvents } from '../config';
import MapScene from './MapScene';
import BonusScene from './BonusScene';
import WaveScene from './WaveScene';
import MenuScene from './MenuScene';
import LightScene from './LightScene';
import ImprovementScene from './ImprovementScene';
import MainSceneManager from './MainSceneManager';
import ScoreScene from './ScoreScene';

export const mainDataKey = 'mainSceneData';

export enum GameStatus {
  Paused = 'paused',
  Reset = 'reset',
  Active = 'active',
  NotStarted = 'not-started',
  Improvement = 'improvement',
}

export const emitGameStatus = 'emit-game-status';

export const gameScenes = [
  [Scenes.MapScene, MapScene],
  [Scenes.EnemyScene, EnemyScene],
  [Scenes.HeroScene, HeroScene],
  [Scenes.BonusScene, BonusScene],
  [Scenes.WaveScene, WaveScene],
  [Scenes.ScoreScene, ScoreScene],
];

export const gameNotActiveScenes = [
  [Scenes.MenuScene, MenuScene],
];

export const otherScenes = [
  [Scenes.LightScene, LightScene],
  [Scenes.ImprovementScene, ImprovementScene],
];

export default class MainScene extends Scene {
  public wave: number = 1;
  public waveDelay: number = config.timeConfigs.waveDelay;
  public enemiesGroup: Phaser.GameObjects.Group;
  public bonusGroup: Phaser.GameObjects.Group;
  public score: number;
  public hero: Hero;
  public ruby: number;
  protected map: Tilemaps.Tilemap;
  private mainSceneManager: MainSceneManager;

  constructor() {
    super(Scenes.MainScene);
    this.score = 0;
    this.ruby = 0;
  }

  createScenes = () => {
    const sharedThis = { [mainDataKey]: this };
    [[[Scenes.MapScene, MapScene]], [[Scenes.MenuScene, MenuScene]]].flat()
      .forEach((s) => this.game.scene.getIndex(s[0] as Scenes) === -1 && this.scene.add(s[0] as Scenes, s[1] as any, false, sharedThis));
  }

  initAddScoreEvents = () => {
    this.game.events.on(GameEvents.AddScore, (score: number) => {
      this.score += score;
    });
  }
  
  create() {
    // @ts-ignore todo
    this.mainSceneManager = new MainSceneManager(this, { gameScenes, gameNotActiveScenes, otherScenes });

    this.enemiesGroup = this.physics.add.group({
      key: 'zombiesGroup',
      collideWorldBounds: true,
    });

    this.bonusGroup = this.physics.add.group({
      key: 'bonusGroup',
    });

    this.createScenes();

    this.initAddScoreEvents();

    this.game.events.on(emitGameStatus, this.mainSceneManager.setGameStatus);

    this.input.keyboard.on('keydown-ESC', () => {
      this.mainSceneManager.setGameStatus(GameStatus.Paused);
    });

    this.scene.launch(Scenes.MenuScene);
  }

  getGameStatus = () => this.mainSceneManager.getGameStatus();

  setGameStatus = (status: GameStatus) => {
    this.mainSceneManager.setGameStatus(status);
  }
}

export interface IMainScene {
  wave: number;
  waveDelay: number;
  enemiesGroup: Phaser.GameObjects.Group;
  bonusGroup: Phaser.GameObjects.Group;
  hero: Hero;
  score: number;
  map: Tilemaps.Tilemap;
  ruby: number;
  getGameStatus: () => GameStatus,
  setGameStatus: (status: GameStatus) => void,
}
