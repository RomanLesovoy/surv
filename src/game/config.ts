export enum EnemyType {
  Zombie = 'zombie',
  Monster = 'monster',
}

export const localStorageKey = 'surv-data';

export default {
  defaultHeroStats: {
    speed: 150,
    damage: 50,
    hp: 100,
    damageStatIncrease: 5,
    speedStatIncrease: 25,
    hpStatIncrease: 20,
  },
  enemiesStats: {
    [`${EnemyType.Zombie}Level1`]: {
      hp: 90,
      timerAttack: 1000,
      speed: 50,
      damage: 20,
      damageWaveIncrease: 3,
      speedWaveIncrease: 5,
      hpWaveIncrease: 8,
      size: 80,
    },
    [`${EnemyType.Monster}Level1`]: {
      hp: 200,
      timerAttack: 1300,
      speed: 70,
      damage: 30,
      damageWaveIncrease: 3,
      speedWaveIncrease: 6,
      hpWaveIncrease: 15,
      size: 150,
    },
    [`${EnemyType.Monster}Level2`]: {
      hp: 300,
      timerAttack: 1000,
      speed: 100,
      damage: 40,
      damageWaveIncrease: 3,
      speedWaveIncrease: 6,
      hpWaveIncrease: 20,
      size: 200,
    },
    [`${EnemyType.Monster}Level3`]: {
      hp: 500,
      timerAttack: 1300,
      speed: 70,
      damage: 60,
      damageWaveIncrease: 4,
      speedWaveIncrease: 4,
      hpWaveIncrease: 30,
      size: 250,
    },
  },
  general: {
    defaultBodyDepth: 5,
    defaultVolume: 0.1,
    highLevelBonus: 5,
    // waveEnemyAdd: 5,
    portalActiveFromWave: 4,
  },
  timeConfigs: {
    bonusDelay: 10000,
    waveDelay: 20000,
    waveDelayOffset: 3000,
    maxWaveDelay: 120000,
    getZombieDelay: (wave: number) => 1500 - wave * 30,
    getPortalDelayWave: (wave: number) => 2000 - wave * 30,
    portalCallback: 1500,
  }
}

export enum GameEvents {
  AddScore = 'add-score',
  CreateRuby = 'create-ruby',
}
