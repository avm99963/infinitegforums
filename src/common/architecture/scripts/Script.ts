/**
 * @deprecated
 */
export enum ScriptRunPhase {
  /**
   * Executed before any Javascript is executed.
   */
  Start,
  /**
   * Executed after the document is ready.
   */
  Main,
}

/**
 * @deprecated
 */
export enum ScriptEnvironment {
  ContentScript,
  InjectedScript,
}

/**
 * @deprecated
 */
export enum ScriptPage {
  CommunityConsole,
}

/**
 * @deprecated
 */
export const ScriptRunPhaseToRunTime: Record<
  ScriptRunPhase,
  chrome.userScripts.RunAt
> = {
  [ScriptRunPhase.Start]: 'document_start',
  [ScriptRunPhase.Main]: 'document_idle',
};

/**
 * @deprecated
 */
export const ScriptEnvironmentToExecutionWorld: Record<
  ScriptEnvironment,
  chrome.scripting.ExecutionWorld
> = {
  [ScriptEnvironment.ContentScript]: 'ISOLATED',
  [ScriptEnvironment.InjectedScript]: 'MAIN',
};

export type ConcreteScript = { new (): Script };

export default abstract class Script {
  /**
   * Priority with which the script is executed. Scripts with a lower value are
   * executed first.
   */
  readonly priority: number = 2 ** 31;

  /**
   * Page where the script should be executed.
   * @deprecated
   */
  abstract readonly page: ScriptPage;

  /**
   * Environment where the script should be executed.
   * @deprecated
   */
  abstract readonly environment: ScriptEnvironment;

  /**
   * If {@link environment} is {@link ScriptEnvironment.ContentScript}, phase of
   * the page loading when the script should be executed.
   * @deprecated
   */
  abstract readonly runPhase?: ScriptRunPhase;

  /**
   * Method which contains the logic of the script.
   */
  abstract execute(): void;
}
