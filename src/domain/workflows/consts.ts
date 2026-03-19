/**
 * URL which is set in the message.source_message.attribution[*].url field of
 * replies posted by a workflow.
 *
 * This lets us identify them later, so users of the workflows feature feel less
 * compelled to abuse it.
 */
export const REPLY_POSTED_BY_WORKFLOW_CANONICAL_URL =
  'https://s.iavm.xyz/twpt-bulk-crs-in-workflows';
