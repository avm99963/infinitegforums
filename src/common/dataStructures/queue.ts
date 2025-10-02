export class Queue<T> {
  private head: LinkedNode<T> | undefined;
  private tail: LinkedNode<T> | undefined;

  enqueue(val: T) {
    const newNode = new LinkedNode(val);
    if (this.tail === undefined) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.nextNode = newNode;
      this.tail = newNode;
    }
  }

  dequeue() {
    if (this.head === undefined) {
      throw new Error('An element was attempted to be dequeued but the queue is empty.');
    }

    const val = this.head.val;
    const newHead = this.head.nextNode;
    this.head = newHead;
    if (newHead === undefined) {
      this.tail = undefined;
    }
    return val;
  }

  isEmpty() {
    return this.head === undefined;
  }
}

class LinkedNode<T> {
  constructor(public val: T, public nextNode: LinkedNode<T> | undefined = undefined) { }
}
