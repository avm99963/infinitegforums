export interface RequestMessageData<R> {
  target: string;
  uuid: string;
  action: string;
  request: R;
}

export interface ResponseMessageData<R> {
  target: string;
  uuid: string;
  action: string;
  response: R;
}
