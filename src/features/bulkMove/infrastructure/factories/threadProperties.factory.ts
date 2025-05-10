import { ThreadProperty } from '../../../../domain/threadProperty';

export class ThreadPropertiesFactory {
  convertEntityListToProtobuf(threadProperties: ThreadProperty[]) {
    return threadProperties.map((property) =>
      this.convertEntityToProtobuf(property),
    );
  }

  convertEntityToProtobuf(threadProperties: ThreadProperty) {
    return {
      '1': threadProperties.key,
      '2': threadProperties.value,
    };
  }
}
