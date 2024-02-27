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
    speedStatIncrease: 20,
    hpStatIncrease: 10,
  },
  enemiesStats: {
    [`${EnemyType.Zombie}Level1`]: {
      hp: 90,
      timerAttack: 1000,
      speed: 50,
      damage: 20,
      damageWaveIncrease: 1,
      speedWaveIncrease: 5,
      hpWaveIncrease: 5,
      size: 80,
    },
    [`${EnemyType.Monster}Level1`]: {
      hp: 200,
      timerAttack: 1500,
      speed: 70,
      damage: 30,
      damageWaveIncrease: 3,
      speedWaveIncrease: 5,
      hpWaveIncrease: 10,
      size: 150,
    },
    [`${EnemyType.Monster}Level2`]: {
      hp: 300,
      timerAttack: 1000,
      speed: 100,
      damage: 40,
      damageWaveIncrease: 3,
      speedWaveIncrease: 5,
      hpWaveIncrease: 10,
      size: 200,
    },
    [`${EnemyType.Monster}Level3`]: {
      hp: 500,
      timerAttack: 1500,
      speed: 70,
      damage: 60,
      damageWaveIncrease: 5,
      speedWaveIncrease: 5,
      hpWaveIncrease: 20,
      size: 200,
    },
  },
  general: {
    defaultBodyDepth: 5,
    defaultVolume: 0.1,
    highLevelBonus: 5,
    waveEnemyAdd: 5,
  },
  timeConfigs: {
    bonusDelay: 15000,
    waveDelay: 20000,
    enemyDelay: 3000,
  }
}

export enum GameEvents {
  AddScore = 'add-score',
  CreateRuby = 'create-ruby',
}
