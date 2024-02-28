export enum EnemyType {
  Zombie = 'zombie',
  Monster = 'monster',
}

export default {
  defaultHeroStats: {
    speed: 200,
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
      hpWaveIncrease: 6,
      size: 80,
    },
    [`${EnemyType.Monster}Level1`]: {
      hp: 200,
      timerAttack: 1300,
      speed: 70,
      damage: 30,
      damageWaveIncrease: 3,
      speedWaveIncrease: 7,
      hpWaveIncrease: 15,
      size: 150,
    },
    [`${EnemyType.Monster}Level2`]: {
      hp: 300,
      timerAttack: 1000,
      speed: 100,
      damage: 40,
      damageWaveIncrease: 4,
      speedWaveIncrease: 8,
      hpWaveIncrease: 25,
      size: 200,
    },
    [`${EnemyType.Monster}Level3`]: {
      hp: 500,
      timerAttack: 1300,
      speed: 70,
      damage: 60,
      damageWaveIncrease: 5,
      speedWaveIncrease: 7,
      hpWaveIncrease: 40,
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
    bonusDelay: 15000,
    waveDelay: 20000,
    waveDelayOffset: 3000,
    maxWaveDelay: 60000,
    zombieDelay: 1500,
    portalDelay: 2000,
    portalCallback: 1500,
  }
}

export enum GameEvents {
  AddScore = 'add-score',
  CreateRuby = 'create-ruby',
}
