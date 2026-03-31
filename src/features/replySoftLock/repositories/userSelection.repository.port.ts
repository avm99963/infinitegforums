export interface ReplySoftLockUserSelectionRepositoryPort {
  /**
   * Updates whether the user enabled the option to soft lock the current
   * thread.
   */
  setShouldSoftLock(enable: boolean): Promise<void>;

  /**
   * Whether the user enabled the option to soft lock the current thread.
   */
  shouldSoftLock(): Promise<boolean>;
}
