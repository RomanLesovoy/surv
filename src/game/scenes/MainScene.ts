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

export const mainDataKey = 'mainSceneData';

export enum GameStatus {
  Paused = 'paused',
  Reset = 'reset',
  Active = 'active',
  NotStarted = 'not-started', // todo
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
    [gameNotActiveScenes, gameScenes].flat()
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

  protected resetGame = () => {
    gameScenes.forEach((s) => this.scene.launch(s[0] as Scenes));
  }

  protected resumeGame = (status: GameStatus) => {
    gameScenes.forEach((s) => {
      if (this.scene.isPaused(s[0] as Scenes) && ![GameStatus.NotStarted, GameStatus.Reset].includes(status)) {
        return this.scene.resume(s[0] as Scenes);
      }
      return this.scene.launch(s[0] as Scenes);
    });
    gameNotActiveScenes.forEach((s) => {
      this.scene.pause(s[0] as Scenes);

      // move to bottom of scenes
      gameScenes.forEach(() => {
        this.scene.moveDown(s[0] as Scenes);
      });
    });
  }

  protected pauseGame = () => {
    gameScenes.forEach((s) => this.game.scene.pause(s[0] as Scenes));
    gameNotActiveScenes.forEach((s) => {
      this.scene.resume(s[0] as Scenes);
      this.scene.bringToTop(s[0] as Scenes);
    });
  }

  protected setGameStatus = (status: GameStatus) => {
    if (status === this.#gameStatus) return;

    const actions = {
      [GameStatus.Reset]: this.resumeGame,
      [GameStatus.NotStarted]: this.pauseGame,
      [GameStatus.Paused]: this.pauseGame, 
      [GameStatus.Active]: this.resumeGame,
    }
    
    this.#gameStatus = status;
    actions[status] && actions[status](status);
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
