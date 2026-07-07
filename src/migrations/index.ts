import * as migration_20260707_113551_initial from './20260707_113551_initial';
import * as migration_20260707_152032_content_model from './20260707_152032_content_model';

export const migrations = [
  {
    up: migration_20260707_113551_initial.up,
    down: migration_20260707_113551_initial.down,
    name: '20260707_113551_initial',
  },
  {
    up: migration_20260707_152032_content_model.up,
    down: migration_20260707_152032_content_model.down,
    name: '20260707_152032_content_model'
  },
];
