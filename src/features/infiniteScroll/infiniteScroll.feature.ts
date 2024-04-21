import Feature from '../../common/architecture/features/Feature';
import { ConcreteScript } from '../../common/architecture/scripts/Script';
import CCInfiniteScrollScript from './scripts/ccInfiniteScroll.script';

export default class InfiniteScrollFeature extends Feature {
  public readonly scripts: ConcreteScript[] = [CCInfiniteScrollScript];

  readonly codename = 'infiniteScroll';
  readonly relatedOptions = ['list', 'thread', 'threadall'];
}
