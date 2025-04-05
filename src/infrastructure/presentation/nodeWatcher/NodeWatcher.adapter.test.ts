import { beforeAll, describe, expect, it, vi } from 'vitest';
import { waitFor } from '@testing-library/dom';
import { NodeWatcherAdapter } from './NodeWatcher.adapter';
import {
  NodeMutationType,
  NodeWatcherHandler,
} from '../../../presentation/nodeWatcher/NodeWatcherHandler';

describe('NodeWatcherAdapter', () => {
  beforeAll(() => {
    vi.resetAllMocks();
  });

  const createFakeHandler = () => {
    return {
      nodeFilter: vi.fn<NodeWatcherHandler['nodeFilter']>(),
      onMutatedNode: vi.fn<NodeWatcherHandler['onMutatedNode']>(),
    };
  };

  describe('Regarding start', () => {
    it('should not throw an error when calling start', () => {
      const sut = new NodeWatcherAdapter();

      expect(() => sut.start()).not.toThrow();
    });

    it('should only call MutationObserver.prototype.observe 1 time after calling start 2 times', () => {
      const sut = new NodeWatcherAdapter();

      const observeSpy = vi.spyOn(MutationObserver.prototype, 'observe');

      sut.start();
      sut.start();

      expect(observeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Regarding setHandler', () => {
    it('should not throw an error when setting a handler', () => {
      const sut = new NodeWatcherAdapter();

      const key = 'handler';
      const handler = createFakeHandler();
      expect(() => sut.setHandler(key, handler)).not.toThrow();
    });

    it('should call onMutatedNode when watching the node for initial discovery and it already exists in the DOM when the handler is set', async () => {
      const nodeTestId = 'test-node';

      const key = 'handler';
      const handler = {
        ...createFakeHandler(),
        initialDiscoverySelector: '[data-testid="test-node"]',
      };
      handler.nodeFilter.mockImplementation((nodeMutation) => {
        return (
          nodeMutation.node instanceof HTMLElement &&
          nodeMutation.type === NodeMutationType.InitialDiscovery &&
          nodeMutation.node.getAttribute('data-testid') === nodeTestId
        );
      });

      const newNode = document.createElement('div');
      newNode.setAttribute('data-testid', nodeTestId);
      document.body.append(newNode);

      const sut = new NodeWatcherAdapter();
      sut.setHandler(key, handler);

      await waitFor(() => {
        expect(handler.onMutatedNode).toHaveBeenCalledTimes(1);
      });
    });

    it('should call onMutatedNode when watching for node creation and the watched node is created', async () => {
      const nodeTestId = 'new-node';

      const key = 'handler';
      const handler = createFakeHandler();
      handler.nodeFilter.mockImplementation((nodeMutation) => {
        return (
          nodeMutation.node instanceof HTMLElement &&
          nodeMutation.type === NodeMutationType.NewNode &&
          nodeMutation.node.getAttribute('data-testid') === nodeTestId
        );
      });

      const sut = new NodeWatcherAdapter();
      sut.setHandler(key, handler);

      const newNode = document.createElement('div');
      newNode.setAttribute('data-testid', nodeTestId);
      document.body.append(newNode);

      await waitFor(() => {
        expect(handler.onMutatedNode).toHaveBeenCalledTimes(1);
      });
    });

    it('should call onMutatedNode when watching for node removal and the watched node is removed', async () => {
      const nodeTestId = 'will-not-last-very-long';

      const key = 'handler';
      const handler = createFakeHandler();
      handler.nodeFilter.mockImplementation((nodeMutation) => {
        return (
          nodeMutation.node instanceof HTMLElement &&
          nodeMutation.type === NodeMutationType.RemovedNode &&
          nodeMutation.node.getAttribute('data-testid') === nodeTestId
        );
      });

      const node = document.createElement('div');
      node.setAttribute('data-testid', nodeTestId);
      document.body.append(node);

      const sut = new NodeWatcherAdapter();
      sut.setHandler(key, handler);

      node.remove();

      await waitFor(() => {
        expect(handler.onMutatedNode).toHaveBeenCalledTimes(1);
      });
    });

    it('should not call nodeFilter when a mutation other than a node being added or removed is fired', async () => {
      const nodeTestId = 'test-node';

      const key = 'handler';
      const handler = createFakeHandler();
      handler.nodeFilter.mockImplementation((nodeMutation) => {
        return (
          nodeMutation.node instanceof HTMLElement &&
          nodeMutation.type === NodeMutationType.RemovedNode &&
          nodeMutation.node.getAttribute('data-testid') === nodeTestId
        );
      });

      const node = document.createElement('div');
      node.setAttribute('data-testid', nodeTestId);
      document.body.append(node);

      const sut = new NodeWatcherAdapter();
      sut.setHandler(key, handler);

      node.setAttribute('data-someattribute', 'random-value');

      await waitFor(() => {
        expect(handler.nodeFilter).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('Regarding removeHandler', () => {
    it('should not call nodeFilter nor onMutatedNode when a node changes but the handler has been removed', async () => {
      const nodeTestId = 'test-node';

      const key = 'handler';
      const handler = createFakeHandler();
      handler.nodeFilter.mockReturnValue(true);

      const sut = new NodeWatcherAdapter();
      sut.setHandler(key, handler);
      sut.removeHandler(key);

      const node = document.createElement('div');
      node.setAttribute('data-testid', nodeTestId);
      document.body.append(node);

      await waitFor(() => {
        expect(handler.nodeFilter).toHaveBeenCalledTimes(0);
        expect(handler.onMutatedNode).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('Regarding pause', () => {
    it('should not call nodeFilter nor onMutatedNode when a node changes but the NodeWatcher has been paused', async () => {
      const nodeTestId = 'test-node';

      const key = 'handler';
      const handler = createFakeHandler();
      handler.nodeFilter.mockReturnValue(true);

      const sut = new NodeWatcherAdapter();
      sut.setHandler(key, handler);
      sut.pause();

      const node = document.createElement('div');
      node.setAttribute('data-testid', nodeTestId);
      document.body.append(node);

      await waitFor(() => {
        expect(handler.nodeFilter).toHaveBeenCalledTimes(0);
        expect(handler.onMutatedNode).toHaveBeenCalledTimes(0);
      });
    });
  });
});
