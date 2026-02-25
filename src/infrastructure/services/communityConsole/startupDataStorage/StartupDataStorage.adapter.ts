import { Queue } from '../../../../common/dataStructures/queue';
import StartupDataModel from '../../../../models/StartupData';
import {
  StartupDataModification,
  StartupDataStoragePort,
} from '../../../../services/communityConsole/startupDataStorage/StartupDataStorage.port';

export default class StartupDataStorageAdapter
  implements StartupDataStoragePort
{
  private isSetUp = false;
  private startupData: StartupDataModel;
  private modificationsQueue = new Queue<StartupDataModification>();

  get(): StartupDataModel {
    this.setUp();
    return this.startupData;
  }

  enqueueModification(
    modification: StartupDataModification,
  ): StartupDataStorageAdapter {
    this.modificationsQueue.enqueue(modification);
    return this;
  }

  applyModifications(): StartupDataStorageAdapter {
    this.setUp();
    while (!this.modificationsQueue.isEmpty()) {
      const modification = this.modificationsQueue.dequeue();
      modification(this.startupData);
    }
    this.persistToDOM();
    return this;
  }

  private setUp() {
    if (this.isSetUp) return;

    this.isSetUp = true;
    const rawData = this.getHtmlElement().getAttribute('data-startup');
    this.startupData = new StartupDataModel(rawData ? JSON.parse(rawData) : {});
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
