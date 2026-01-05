export interface DefaultOptionsCommitterPort {
  /**
   * Save the default values for options that have not been saved to the user
   * options.
   *
   * This allows us to change the default value for an option without affecting
   * existing extension users.
   */
  commit(): Promise<void>;
}
