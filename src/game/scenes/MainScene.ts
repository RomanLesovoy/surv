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
]

export default class MainScene extends Scene {
  protected wave: number = 1; // TODO Not sure
  protected currentWave: number = 1;
  protected enemiesGroup: Phaser.GameObjects.Group;
  protected score: number;
  protected hero: Hero;
  protected map: Tilemaps.Tilemap;
  #gameStatus: GameStatus;

  constructor() {
    super(Scenes.MainScene);
    this.score = 0;
    this.#gameStatus = GameStatus.NotStarted;
  }
  
  create() {
    this.enemiesGroup = this.physics.add.group({
      key: 'zombiesGroup',
      collideWorldBounds: true,
    });

    const sharedThis = { [mainDataKey]: this };
    [gameNotActiveScenes, otherScenes, gameScenes].flat()
      .forEach((s) => this.scene.add(s[0] as Scenes, s[1] as any, false, sharedThis));


    this.game.events.on(GameEvents.AddScore, (score: number) => {
      this.score += score;
    });

    this.game.events.on(emitGameStatus, this.setGameStatus);

    this.input.keyboard.on('keydown-ESC', () => {
      this.setGameStatus(GameStatus.Paused);
    });

    this.scene.launch(Scenes.MenuScene);
  }

  protected getGameStatus(): GameStatus {
    return this.#gameStatus;
  }

  protected resetScore() {
    this.wave = 1;
    this.score = 0;
  }

  protected resumeGame = (status: GameStatus) => {
    this.pauseNotActiveScenes();
    this.resumeGameScenes(status);
  }

  protected pauseGameScenes = () => {
    gameScenes.forEach((s) => this.game.scene.pause(s[0] as Scenes));
  }

  protected resumeGameScenes = (newStatus) => {
    const restart = newStatus === GameStatus.Reset && this.#gameStatus === GameStatus.Paused;
    restart && this.resetScore();
    
    gameScenes.forEach((s) => {
      this.scene.bringToTop(s[0] as Scenes);
      if (restart) {
        return this.game.scene.getScene(s[0] as Scenes).scene.restart();
      }
      if (this.scene.isPaused(s[0] as Scenes) && newStatus === GameStatus.Active) {
        return this.scene.resume(s[0] as Scenes);
      }
      return this.scene.launch(s[0] as Scenes);
    });
  }

  protected pauseNotActiveScenes = () => {
    gameNotActiveScenes.forEach((s) => {
      this.scene.pause(s[0] as Scenes);
    

      // move to bottom of scenes
      // gameScenes.forEach(() => {
      //   this.scene.moveDown(s[0] as Scenes);
      // });
    });
  }

  protected resumeNotActiveScenes = () => {
    gameNotActiveScenes.forEach((s) => {
      this.scene.bringToTop(s[0] as Scenes);
      this.scene.resume(s[0] as Scenes);
    });
  }

  protected pauseAndMenu = () => {
    this.pauseGameScenes();
    this.resumeNotActiveScenes();
  }

  protected setGameStatus = (status: GameStatus) => {
    if (status === this.#gameStatus) return;

    const actions = {
      [GameStatus.Reset]: this.resumeGame,
      [GameStatus.NotStarted]: this.pauseAndMenu,
      [GameStatus.Paused]: this.pauseAndMenu, 
      [GameStatus.Active]: this.resumeGame,
      [GameStatus.Improvement]: this.pauseGameScenes, 
    }
    
    actions[status] && actions[status](status);
    this.#gameStatus = status; // update after action processed.
    this.game.events.emit(status);
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
