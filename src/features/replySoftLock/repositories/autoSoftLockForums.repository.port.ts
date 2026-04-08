export interface AutoSoftLockForumsRepositoryPort {
  /**
   * Get a list of forum ids where the soft lock checkbox should be enabled
   * automatically.
   */
  get(): Promise<string[]>;

  /**
   * Enable or disable auto-soft locking in the specified forum.
   */
  setAutoSoftLock(forumId: string, enable: boolean): Promise<void>;
}
