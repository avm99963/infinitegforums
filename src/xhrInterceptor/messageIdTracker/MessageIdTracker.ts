export default class MessageIdTracker {
  private messageId = 0;

  getNewId() {
    return this.messageId++;
  }
}
