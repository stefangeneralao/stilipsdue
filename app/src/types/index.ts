export type TTodoStatus = 'todo' | 'inProgress' | 'done';

export type TSwimlane = 'dailies' | 'weeklies' | 'monthlies' | 'singles';

export interface ITodo {
  id: string;
  label: string;
  status: TTodoStatus;
  swimlane: TSwimlane;
  index: number;
}

export interface ITodos {
  dailies: ITodo[];
  weeklies: ITodo[];
  monthlies: ITodo[];
  singles: ITodo[];
}
