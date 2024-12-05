import ThreadModel from './Thread.ts';

export default class GapModel {
  constructor(data, thread) {
    this.data = data ?? {};
    this.thread = thread ?? new ThreadModel();
  }

  getCount() {
    const a = this.data[1] ?? null;
    return a != null ? a : 0;
  }

  setCount(value) {
    this.data[1] = Number(value);
  }

  getStartMicroseconds() {
    return this.data[2] ?? null;
  }

  setStartMicroseconds(value) {
    this.data[2] = '' + value;
  }

  getStartTimestamp() {
    let a = this.getStartMicroseconds();
    if (a == null) a = '0';
    return BigInt(a);
  }

  getEndMicroseconds() {
    return this.data[3] ?? null;
  }

  setEndMicroseconds(value) {
    this.data[3] = '' + value;
  }

  getEndTimestamp() {
    let a = this.getEndMicroseconds();
    if (a == null) a = '0';
    return BigInt(a);
  }

  getParentId() {
    const a = this.data[4];
    return a ? Number(a) : 0;
  }

  setParentId(value) {
    this.data[4] = '' + value;
  }

  toRawMessageOrGap() {
    return {2: this.data};
  }
}
