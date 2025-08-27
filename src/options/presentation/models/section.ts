import { TemplateResult } from 'lit';
import { Feature } from './feature';

export interface FeatureSectionConfig {
  name: string;
  note?: string | TemplateResult;
  features?: Feature[];
}

export class FeatureSection {
  public features?: Feature[];
  public name: string;
  public note?: string | TemplateResult;

  constructor(config: FeatureSectionConfig) {
    this.name = config.name;
    this.note = config.note;
    this.features = config.features;
  }
}
