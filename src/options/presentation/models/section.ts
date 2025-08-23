import { Feature } from "./feature";

export interface FeatureSectionConfig {
  name: string;
  note?: string;
  features?: Feature[];
}

export class FeatureSection {
  public features?: Feature[];
  public name: string;
  public note?: string;

  constructor(config: FeatureSectionConfig) {
    this.name = config.name;
    this.note = config.note;
    this.features = config.features;
  }
}
