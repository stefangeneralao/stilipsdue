import { StatusId, SwimlaneId, Task } from '/types';

export interface Status {
  friendlyName: string;
  tasks: Task[];
}

export interface Swimlane {
  friendlyName: string;
  statuses: {
    [id in StatusId]: Status;
  };
}

export interface TasksState {
  swimlanes: {
    [id in SwimlaneId]: Swimlane;
  };
}
