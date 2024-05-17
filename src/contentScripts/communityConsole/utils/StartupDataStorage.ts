import { Queue } from '@datastructures-js/queue';
import StartupDataModel from '../../../models/StartupData';

type StartupDataModification = (startupData: StartupDataModel) => void;

export default class StartupDataStorage {
  private startupData: StartupDataModel;
  private modificationsQueue: Queue<StartupDataModification>;

  constructor() {
    const rawData = this.getHtmlElement().getAttribute('data-startup');
    this.startupData = new StartupDataModel(rawData ? JSON.parse(rawData) : {});
    this.modificationsQueue = new Queue();
  }

  get(): StartupDataModel {
    return this.startupData;
  }

  enqueueModification(
    modification: StartupDataModification,
  ): StartupDataStorage {
    this.modificationsQueue.enqueue(modification);
    return this;
  }

  applyModifications(): StartupDataStorage {
    while (!this.modificationsQueue.isEmpty()) {
      const modification = this.modificationsQueue.dequeue();
      modification(this.startupData);
    }
    this.persistToDOM();
    return this;
  }

  private persistToDOM() {
    const serializedData = JSON.stringify(this.startupData.data);
    this.getHtmlElement().setAttribute('data-startup', serializedData);
  }

  private getHtmlElement() {
    const htmlElement = document.querySelector('html');
    if (!htmlElement) {
      throw new Error("StartupDataStorage: couldn't find the html element.");
    }
    return htmlElement;
  }
}
