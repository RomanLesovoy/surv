import MainScene, { emitGameStatus } from './MainScene';
import { GameStatus } from './MainScene';
import { Scenes } from './scenes-enum';
import MenuScene from './MenuScene';
import ImprovementScene from './ImprovementScene';
import MapScene from './MapScene';
import config from '../config';

interface IScenes {
  gameScenes: (Scenes | typeof MapScene)[][],
  gameNotActiveScenes: (Scenes | typeof MenuScene)[][],
  otherScenes: (Scenes | typeof ImprovementScene)[][],
}

export default class MainSceneManager {
  private mainSceneInstance!: MainScene;
  private scenes!: IScenes;
  private gameStatus: GameStatus;

  constructor (mainSceneInstance: MainScene, scenes: IScenes) {
    this.mainSceneInstance = mainSceneInstance;
    this.scenes = scenes;
    this.gameStatus = GameStatus.NotStarted;
  }

  private resetScore = () => {
    this.mainSceneInstance.wave = 1;
    this.mainSceneInstance.waveDelay = config.timeConfigs.waveDelay;
    this.mainSceneInstance.score = 0;
    this.mainSceneInstance.ruby = 0;
  }

  private resumeGame = (status: GameStatus) => {
    this.pauseNotActiveScenes();
    this.resumeGameScenes(status);
  }

  private pauseGameScenes = () => {
    this.scenes.gameScenes.forEach((s) => this.mainSceneInstance.game.scene.isActive(s[0] as Scenes) && this.mainSceneInstance.game.scene.pause(s[0] as Scenes));
  }

  private restartGame = () => {
    this.resetScore();
    this.mainSceneInstance.enemiesGroup.clear(true, true);
    this.mainSceneInstance.bonusGroup.clear(true, true);
    this.mainSceneInstance.hero.resetHero();
    this.mainSceneInstance.game.scene.getScene(Scenes.EnemyScene).scene.restart();
    this.mainSceneInstance.game.scene.getScene(Scenes.BonusScene).scene.restart();
    this.mainSceneInstance.game.scene.getScene(Scenes.WaveScene).scene.restart();
  }

  private resumeGameScenes = (newStatus) => {
    const restart = newStatus === GameStatus.Reset && this.gameStatus === GameStatus.Paused;

    if (restart) {
      this.restartGame();
    }
    
    this.scenes.gameScenes.forEach((s) => {
      this.mainSceneInstance.scene.bringToTop(s[0] as Scenes);
      this.mainSceneInstance.scene.run(s[0] as Scenes);
    });
  }

  private pauseNotActiveScenes = () => {
    this.scenes.gameNotActiveScenes.forEach((s) => {
      this.mainSceneInstance.game.scene.isActive(s[0] as Scenes) && this.mainSceneInstance.scene.stop(s[0] as Scenes);
      this.mainSceneInstance.scene.sendToBack(s[0] as Scenes);
    });
  }

  private resumeNotActiveScenes = () => {
    this.scenes.gameNotActiveScenes.forEach((s) => {
      this.mainSceneInstance.scene.bringToTop(s[0] as Scenes);
      this.mainSceneInstance.scene.run(s[0] as Scenes);
    });
  }

  private pauseAndMenu = () => {
    this.pauseGameScenes();
    this.resumeNotActiveScenes();
  }

  public getGameStatus(): GameStatus {
    return this.gameStatus;
  }

  public setGameStatus = (status: GameStatus) => {
    if (status === this.gameStatus) return;

    const actions = {
      [GameStatus.Reset]: this.resumeGame,
      [GameStatus.NotStarted]: this.pauseAndMenu,
      [GameStatus.Paused]: this.pauseAndMenu, 
      [GameStatus.Active]: this.resumeGame,
      [GameStatus.Improvement]: this.pauseGameScenes, 
    }
    
    actions[status] && actions[status](status);
    this.gameStatus = status; // update after action processed.
    this.mainSceneInstance.game.events.emit(emitGameStatus, status);
  }
}
