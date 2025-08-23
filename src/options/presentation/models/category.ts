import { Feature } from './feature';
import { FeatureSection } from './section';

export interface FeatureCategoryConfig {
  /** Unique ID for internal purposes. */
  id: string;
  name: string;
  note?: string;
  features?: Feature[];
  sections?: FeatureSection[];
}

export class FeatureCategory {
  /** Unique ID for internal purposes. */
  public id: string;
  public name: string;
  public note?: string;
  public features?: Feature[];
  public sections?: FeatureSection[];

  constructor(config: FeatureCategoryConfig) {
    this.id = config.id;
    this.name = config.name;
    this.note = config.note;
    this.features = config.features;
    this.sections = config.sections;
  }
}
