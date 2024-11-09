import StartupDataModel from "../../models/StartupData";

export interface StartupDataStoragePort {
  /**
   * Get the startup data as stored in this class (without having applied any
   * queued modification).
   *
   * NOTE: This might not be synced with the live startup data which exists in the
   * DOM.
   */
  get(): StartupDataModel;

  /* Enqueue a function which includes a modification to the startup data. */
  enqueueModification(
    modification: StartupDataModification,
  ): StartupDataStoragePort;

  /* Apply all the queued modifications and persist the result to the DOM. */
  applyModifications(): StartupDataStoragePort;
}

export type StartupDataModification = (startupData: StartupDataModel) => void;
