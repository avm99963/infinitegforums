import { OptionCodename } from '../../../common/options/optionsPrototype';
import { SubOption } from './subOption';

export interface FeatureConfig {
  optionCodename: OptionCodename;
  name: string;
  description?: string;
  note?: string;
  subOptions?: SubOption[];
  demoMedia?: {
    imgUrl?: string;
    videoUrl?: string;
  };
  tags?: string[];
}

export class Feature {
  public optionCodename: OptionCodename;
  public name: string;
  public description?: string;
  public note?: string;
  public subOptions?: SubOption[];
  public demoMedia?: {
    imgUrl?: string;
    videoUrl?: string;
  };
  public tags?: string[];

  constructor(config: FeatureConfig) {
    this.optionCodename = config.optionCodename;
    this.name = config.name;
    this.description = config.description;
    this.note = config.note;
    this.subOptions = config.subOptions;
    this.demoMedia = config.demoMedia;
    this.tags = config.tags;
  }
}
