/**
 * @file Manual type declarations which substitute the broken automatic types
 * generation.
 *
 * It is a catch-all for all available classes/types.
 *
 * TODO(https://iavm.xyz/b/twpowertools/271): Fix the TS protobuf generation and
 * delete this file.
 */

/**
 * workflows package.
 */
export namespace workflows {
  // We use a class for Action since there are sub-classes, and we can't define
  // it as an const with type any.
  export class Action {
    constructor(...args: any[]);
    [key: string]: any;
  }
  export namespace Action {
    export type ActionCase = any;
    export const ActionCase: any;

    export class AttributeAction {
      constructor(...args: any[]);
      [key: string]: any;
    }
    export namespace AttributeAction {
      export type AttributeAction = any;
      export const AttributeAction: any;
    }
    export type MarkAsReadAction = any;
    export const MarkAsReadAction: any;

    export type MarkAsUnreadAction = any;
    export const MarkAsUnreadAction: any;

    export type MarkDuplicateAction = any;
    export const MarkDuplicateAction: any;

    export type MoveAction = any;
    export const MoveAction: any;

    export type ReplyAction = any;
    export const ReplyAction: any;

    export type ReplyWithCRAction = any;
    export const ReplyWithCRAction: any;

    export class ReportAction {
      constructor(...args: any[]);
      [key: string]: any;
    }
    export namespace ReportAction {
      export type ReportType = any;
      export const ReportType: any;
    }

    export type StarAction = any;
    export const StarAction: any;

    export type SubscribeAction = any;
    export const SubscribeAction: any;

    export type UnmarkDuplicateAction = any;
    export const UnmarkDuplicateAction: any;

    export class VoteAction {
      constructor(...args: any[]);
      [key: string]: any;
    }
    export namespace VoteAction {
      export type Vote = any;
      export const Vote: any;
    }
  }

  export type Thread = any;
  export const Thread: any;

  export type Workflow = any;
  export const Workflow: any;
}
