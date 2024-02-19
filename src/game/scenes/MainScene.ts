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

export const mainDataKey = 'mainSceneData';

export enum GameStatus {
  Paused = 'paused',
  Ended = 'ended', // todo
  Active = 'active',
  NotStarted = 'not-started', // todo
}

const gameScenes = [
  [Scenes.MapScene, MapScene],
  [Scenes.EnemyScene, EnemyScene],
  [Scenes.HeroScene, HeroScene],
  [Scenes.BonusScene, BonusScene],
  [Scenes.ScoreScene, ScoreScene],
  [Scenes.WaveScene, WaveScene],
];

export default class MainScene extends Scene {
  protected unitsLevel: number = 1; // TODO Not sure
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

    this.game.events.on(GameEvents.AddScore, (score: number) => {
      this.score += score;
    });

    this.setGameStatus(GameStatus.Active);
  }

  protected getGameStatus(): GameStatus {
    return this.#gameStatus;
  }

  protected setGameStatus(status: GameStatus) {
    if (status === this.#gameStatus) return;
    this.#gameStatus = status;
    const sharedThis = { [mainDataKey]: this };

    if (status === GameStatus.Active) {
      gameScenes.forEach((s) => {
        this.scene.getIndex(s[0] as Scenes) === -1
          ? this.scene.add(s[0] as Scenes, s[1] as any, true, sharedThis)
          : this.scene.resume(s[0] as Scenes)
      });
    }
    if (status === GameStatus.Paused) {
      gameScenes.forEach((s) => this.game.scene.pause(s[0] as Scenes));
    }
  }
}

export interface IMainScene {
  unitsLevel: number;
  enemiesGroup: Phaser.GameObjects.Group;
  hero: Hero;
  score: number;
  map: Tilemaps.Tilemap;
  getGameStatus: () => GameStatus,
  setGameStatus: (status: GameStatus) => void,
}
