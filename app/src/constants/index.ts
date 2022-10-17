import { StatusId, SwimlaneId } from '/types';

export const friendlyNameMap: Record<SwimlaneId | StatusId, string> = {
  todo: 'Todo',
  doASAP: 'Do ASAP',
  done: 'Done',
  dailies: 'Dailies',
  weeklies: 'Weeklies',
  monthlies: 'Monthlies',
  singles: 'Singles',
};
