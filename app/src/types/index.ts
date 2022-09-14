export interface ITodo {
  id: string;
  label: string;
  status: 'TOOD' | 'IN_PROGRESS' | 'DONE';
}

export interface ITodos {
  dailies: ITodo[];
  weeklies: ITodo[];
  monthlies: ITodo[];
  singles: ITodo[];
}
