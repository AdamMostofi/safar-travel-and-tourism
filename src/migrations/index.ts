import * as migration_20260707_113551_initial from './20260707_113551_initial';

export const migrations = [
  {
    up: migration_20260707_113551_initial.up,
    down: migration_20260707_113551_initial.down,
    name: '20260707_113551_initial'
  },
];
