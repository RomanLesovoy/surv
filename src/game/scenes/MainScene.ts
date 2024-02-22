import { Scene, Tilemaps } from 'phaser';
import { Scenes } from './scenes-enum';
import Hero from '../classes/Hero';
import HeroScene from './HeroScene';
import EnemyScene from './EnemyScene';
import ScoreScene from './ScoreScene';
import { GameEvents } from '../game-events';
import MapScene from './MapScene';
import BonusScene from './BonusScene';
import WaveScene from './WaveScene';
import MenuScene from './MenuScene';
import LightScene from './LightScene';
import ImprovementScene from './ImprovementScene';
import MainSceneManager from './MainSceneManager';

export const mainDataKey = 'mainSceneData';

export enum GameStatus {
  Paused = 'paused',
  Reset = 'reset',
  Active = 'active',
  NotStarted = 'not-started',
  Improvement = 'improvement',
}

export const emitGameStatus = 'emit-game-status';

const gameScenes = [
  [Scenes.MapScene, MapScene],
  [Scenes.EnemyScene, EnemyScene],
  [Scenes.HeroScene, HeroScene],
  [Scenes.BonusScene, BonusScene],
  [Scenes.ScoreScene, ScoreScene],
  [Scenes.WaveScene, WaveScene],
];

const gameNotActiveScenes = [
  [Scenes.MenuScene, MenuScene],
];

const otherScenes = [
  [Scenes.LightScene, LightScene],
  [Scenes.ImprovementScene, ImprovementScene],
];

export default class MainScene extends Scene {
  public wave: number = 1;
  public currentWave: number = 1;
  public enemiesGroup: Phaser.GameObjects.Group;
  public score: number;
  public hero: Hero;
  protected map: Tilemaps.Tilemap;
  private mainSceneManager: MainSceneManager;

  constructor() {
    super(Scenes.MainScene);
    this.score = 0;
  
  }

  createScenes = () => {
    const sharedThis = { [mainDataKey]: this };
    [gameNotActiveScenes, otherScenes, gameScenes].flat()
      .forEach((s) => this.game.scene.getIndex(s[0] as Scenes) === -1 && this.scene.add(s[0] as Scenes, s[1] as any, false, sharedThis));
  }

  initAddScoreEvent = () => {
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

    this.createScenes();

    this.initAddScoreEvent();

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
  enemiesGroup: Phaser.GameObjects.Group;
  hero: Hero;
  score: number;
  map: Tilemaps.Tilemap;
  getGameStatus: () => GameStatus,
  setGameStatus: (status: GameStatus) => void,
}
