import * as migration_20260707_113551_initial from './20260707_113551_initial';
import * as migration_20260707_152032_content_model from './20260707_152032_content_model';
import * as migration_20260708_083003_leads from './20260708_083003_leads';
import * as migration_20260708_111400_testimonials from './20260708_111400_testimonials';
import * as migration_20260709_135003_assistant_settings from './20260709_135003_assistant_settings';
import * as migration_20260709_154446_assistant_actions from './20260709_154446_assistant_actions';
import * as migration_20260709_164948_assistant_faq from './20260709_164948_assistant_faq';
import * as migration_20260709_171309_assistant_whatsapp_enquiry from './20260709_171309_assistant_whatsapp_enquiry';
import * as migration_20260710_150217_assistant_remove_name from './20260710_150217_assistant_remove_name';
import * as migration_20260714_120000_media_webp_sizes from './20260714_120000_media_webp_sizes';

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
    name: '20260709_154446_assistant_actions',
  },
  {
    up: migration_20260709_164948_assistant_faq.up,
    down: migration_20260709_164948_assistant_faq.down,
    name: '20260709_164948_assistant_faq',
  },
  {
    up: migration_20260709_171309_assistant_whatsapp_enquiry.up,
    down: migration_20260709_171309_assistant_whatsapp_enquiry.down,
    name: '20260709_171309_assistant_whatsapp_enquiry',
  },
  {
    up: migration_20260710_150217_assistant_remove_name.up,
    down: migration_20260710_150217_assistant_remove_name.down,
    name: '20260710_150217_assistant_remove_name'
  },
  {
    up: migration_20260714_120000_media_webp_sizes.up,
    down: migration_20260714_120000_media_webp_sizes.down,
    name: '20260714_120000_media_webp_sizes'
  },
];
