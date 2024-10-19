import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import NodeWatcherScriptAdapter from './NodeWatcherScript.adapter';
import { NodeWatcherPort } from '../../../presentation/nodeWatcher/NodeWatcher.port';
import { NodeWatcherHandler } from '../../../presentation/nodeWatcher/NodeWatcherHandler';

describe('NodeWatcherScriptAdapter', () => {
  const fakeNodeWatcher: NodeWatcherPort = {
    start: jest.fn<NodeWatcherPort['start']>(),
    pause: jest.fn<NodeWatcherPort['pause']>(),
    setHandler: jest.fn<NodeWatcherPort['setHandler']>(),
    removeHandler: jest.fn<NodeWatcherPort['removeHandler']>(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('When the script is executed', () => {
    it('should start the NodeWatcher', () => {
      const sut = new NodeWatcherScriptAdapter(fakeNodeWatcher, new Map([]));
      sut.execute();

      expect(fakeNodeWatcher.start).toBeCalledTimes(1);
    });

    it('should add the handlers to NodeWatcher', () => {
      const key = 'test-handler';
      const handler: NodeWatcherHandler = {
        nodeFilter: () => false,
        onMutatedNode: () => undefined,
      };
      const handlers = new Map([[key, handler]]);
      const sut = new NodeWatcherScriptAdapter(fakeNodeWatcher, handlers);
      sut.execute();

      expect(fakeNodeWatcher.setHandler).toHaveBeenCalledTimes(1);
      expect(fakeNodeWatcher.setHandler).toHaveBeenCalledWith(key, handler);
    });
  });
});
