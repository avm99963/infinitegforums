export class UnexpectedUIError extends Error {
  constructor(message: string) {
    super(
      `Unexpected UI error: ${message}\nThis error points out that something in the UI has changed, and we have to adapt to it.\nIMPORTANT: Please file a bug at https://iavm.xyz/b/twpowertools/create with this error message. It will help us fix this issue.`,
    );
  }
}
