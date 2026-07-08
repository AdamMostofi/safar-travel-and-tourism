import * as migration_20260707_113551_initial from './20260707_113551_initial';
import * as migration_20260707_152032_content_model from './20260707_152032_content_model';
import * as migration_20260708_083003_leads from './20260708_083003_leads';

export const migrations = [
  {
    up: migration_20260707_113551_initial.up,
    down: migration_20260707_113551_initial.down,
    name: '20260707_113551_initial',
  },
  {
    up: migration_20260707_152032_content_model.up,
    down: migration_20260707_152032_content_model.down,
    name: '20260707_152032_content_model',
  },
  {
    up: migration_20260708_083003_leads.up,
    down: migration_20260708_083003_leads.down,
    name: '20260708_083003_leads'
  },
];
