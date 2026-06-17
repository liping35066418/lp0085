import type { TemplateType, TemplateRule } from '../types';
import { engineeringTemplate } from '../templates/engineering';
import { biologyTemplate } from '../templates/biology';

export const getTemplate = (type: TemplateType): TemplateRule => {
  return type === 'engineering' ? engineeringTemplate : biologyTemplate;
};
