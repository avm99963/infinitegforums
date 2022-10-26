import {parseUrl, recursiveParentElement} from '../../../common/commonUtils.js';
import * as pb from '../../../workflows/proto/main_pb.js';

import CRRunner from './actionRunners/replyWithCR.js';

export default class WorkflowRunner {
  constructor(workflow, updateCallback) {
    this.workflow = workflow;
    this._threads = [];
    this._currentThreadIndex = 0;
    this._currentActionIndex = 0;
    // Can be 'waiting', 'running', 'error', 'finished'
    this._status = 'waiting';
    this._updateCallback = updateCallback;

    // Initialize action runners:
    this._CRRunner = new CRRunner();
  }

  start() {
    this._getSelectedThreads();
    this.status = 'running';
    this._runNextAction();
  }

  _getSelectedThreads() {
    let threads = [];
    const checkboxes = document.querySelectorAll(
        '.thread-group material-checkbox[aria-checked="true"]');

    for (const checkbox of checkboxes) {
      const url = recursiveParentElement(checkbox, 'EC-THREAD-SUMMARY')
                      .querySelector('a.header-content')
                      .href;
      const thread = parseUrl(url);
      if (!thread) {
        console.error('Couldn\'t parse URL ' + url);
        continue;
      }
      threads.push(thread);
    }

    this.threads = threads;
  }

  _showError(err) {
    console.warn(
        `An error ocurred while executing action ${this.currentActionIndex}.`,
        err);
    this.status = 'error';
  }

  _runAction() {
    switch (this._currentAction?.getActionCase?.()) {
      case pb.workflows.Action.ActionCase.REPLY_WITH_CR_ACTION:
        return this._CRRunner.execute(
            this._currentAction?.getReplyWithCrAction?.(), this._currentThread);

      default:
        return Promise.reject(new Error('This action isn\'t supported yet.'));
    }
  }

  _runNextAction() {
    if (this.status !== 'running')
      return console.error(
          'Trying to run next action with status ' + this.status + '.');

    this._runAction()
        .then(() => {
          if (this._nextActionIfAvailable())
            this._runNextAction();
          else
            this._finish();
        })
        .catch(err => this._showError(err));
  }

  _nextActionIfAvailable() {
    if (this.currentActionIndex === this._actions.length - 1) {
      if (this.currentThreadIndex === this.numThreads - 1) return false;

      this.currentThreadIndex++;
      this.currentActionIndex = 0;
      return true;
    }

    this.currentActionIndex++;
    return true;
  }

  _finish() {
    this.status = 'finished';
  }

  get numThreads() {
    return this.threads.length ?? 0;
  }

  get _actions() {
    return this.workflow?.getActionsList?.();
  }

  get _currentAction() {
    return this._actions?.[this.currentActionIndex];
  }

  get _currentThread() {
    return this._threads?.[this.currentThreadIndex];
  }

  // Setters/getters for properties, which will update the UI when changed.
  get threads() {
    return this._threads;
  }

  set threads(value) {
    this._threads = value;
    this._updateCallback();
  }

  get currentThreadIndex() {
    return this._currentThreadIndex;
  }

  set currentThreadIndex(value) {
    this._currentThreadIndex = value;
    this._updateCallback();
  }

  get currentActionIndex() {
    return this._currentActionIndex;
  }

  set currentActionIndex(value) {
    this._currentActionIndex = value;
    this._updateCallback();
  }

  get status() {
    return this._status;
  }

  set status(value) {
    this._status = value;
    this._updateCallback();
  }
}
