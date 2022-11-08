export const statusIds = ["todo", "doASAP", "done"] as const;
export type StatusId = typeof statusIds[number];

export const swimlaneIds = [
  "dailies",
  "weeklies",
  "monthlies",
  "singles",
] as const;
export type SwimlaneId = typeof swimlaneIds[number];

export interface Task {
  id: string;
  label: string;
  status: StatusId;
  swimlane: SwimlaneId;
  index: number;
  description: string;
}

export interface TaskWithUserId extends Task {
  userId: string;
}

export type PartialTask = { id: string } & Partial<Task>;

export type PartialTaskWithUserId = { id: string } & Partial<TaskWithUserId>;

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
