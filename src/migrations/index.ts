import * as migration_20260707_113551_initial from './20260707_113551_initial';
import * as migration_20260707_152032_content_model from './20260707_152032_content_model';
import * as migration_20260708_083003_leads from './20260708_083003_leads';
import * as migration_20260708_111400_testimonials from './20260708_111400_testimonials';
import * as migration_20260709_135003_assistant_settings from './20260709_135003_assistant_settings';
import * as migration_20260709_154446_assistant_actions from './20260709_154446_assistant_actions';

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
    name: '20260708_083003_leads',
  },
  {
    up: migration_20260708_111400_testimonials.up,
    down: migration_20260708_111400_testimonials.down,
    name: '20260708_111400_testimonials',
  },
  {
    up: migration_20260709_135003_assistant_settings.up,
    down: migration_20260709_135003_assistant_settings.down,
    name: '20260709_135003_assistant_settings',
  },
  {
    up: migration_20260709_154446_assistant_actions.up,
    down: migration_20260709_154446_assistant_actions.down,
    name: '20260709_154446_assistant_actions'
  },
];
