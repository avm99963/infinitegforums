import {css} from 'lit';

// TODO: remove this and substitute it with proper localization.
export const kActionHeadings = {
  0: 'Unknown action',
  1: 'Reply',
  2: 'Move to a forum',
  3: 'Mark as duplicate of a thread',
  4: 'Unmark duplicate',
  5: 'Change thread attributes',
  6: 'Reply with canned response',
  16: 'Star/unstar thread',
  17: 'Subscribe/unsubscribe to thread',
  18: 'Vote thread',
  19: 'Report thread',
};

export const kSupportedActions = new Set([6]);

export const kActionStyles = css`
  .action {
    margin-bottom: 20px;
  }

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }

  .step {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;

    min-height: 30px;
    min-width: 30px;
    margin-inline-end: 8px;

    font-weight: 500;
    font-size: 18px;

    border-radius: 50%;
    color: white;
    background-color: #018786;
  }

  :is(.action--idle, .action--running) .step {
    color: black;
    background-color: #d1d1d1;
  }

  .action--error .step {
    background-color: #c30000;
  }

  .step mwc-circular-progress {
    position: absolute;
    --mdc-theme-primary: #018786;
  }

  .title {
    font-weight: 500;
    margin: 0;
    flex-grow: 1;
  }

  .header .select {
    flex-grow: 1;
    width: 300px;
    padding: 4px;
    margin-inline-end: 8px;
    font-size: 16px;
  }
`;
