export interface SelectedThread {
  forumId: string;
  id: string;
  title?: string;
}

export interface GetSelectedThreadsServicePort {
  execute(): SelectedThread[];
}
