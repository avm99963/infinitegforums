export interface OriginalThread {
  forumId: string;
  id: string;
  title: string;
}

export type Status = 'waiting' | 'loading' | 'success' | 'error';

export interface ThreadProgress {
  originalThread: OriginalThread;
  destinationForumId: string;
  status: Status;
  errorMessage?: string;
}

export const COMPLETE_STATES: Status[] = ['success', 'error'];
