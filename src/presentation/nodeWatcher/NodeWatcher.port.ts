import { NodeWatcherHandler } from "./NodeWatcherHandler";

export interface NodeWatcherPort {
  /**
   * Start watching mutations to nodes.
   */
  start(): void;

  /**
   * Pause watching mutations to nodes.
   */
  pause(): void;

  /**
   * Add a handler to watch certain mutations.
   */
  setHandler(key: string, handler: NodeWatcherHandler): void;

  /**
   * Remove a handler by key.
   */
  removeHandler(key: string): boolean;
}
