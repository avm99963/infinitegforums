import { beforeEach, describe, expect, it, vi } from 'vitest';
import NodeWatcherScriptAdapter from './NodeWatcherScript.adapter';
import { NodeWatcherPort } from '../../../presentation/nodeWatcher/NodeWatcher.port';
import { NodeWatcherHandler } from '../../../presentation/nodeWatcher/NodeWatcherHandler';

describe('NodeWatcherScriptAdapter', () => {
  const fakeNodeWatcher: NodeWatcherPort = {
    start: vi.fn<NodeWatcherPort['start']>(),
    pause: vi.fn<NodeWatcherPort['pause']>(),
    setHandler: vi.fn<NodeWatcherPort['setHandler']>(),
    removeHandler: vi.fn<NodeWatcherPort['removeHandler']>(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
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
