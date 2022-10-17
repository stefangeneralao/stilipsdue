import { ObjectId } from 'mongodb';
import { Task } from '/types';

export const tasks: Task[] = [
  {
    id: new ObjectId().toString(),
    label: 'Diska',
    status: 'done',
    swimlane: 'dailies',
    index: 0,
  },
  {
    id: new ObjectId().toString(),
    label: 'Stretcha',
    status: 'doASAP',
    swimlane: 'dailies',
    index: 0,
  },
  {
    id: new ObjectId().toString(),
    label: 'Drick två liter vatten',
    status: 'doASAP',
    swimlane: 'dailies',
    index: 1,
  },
  {
    id: new ObjectId().toString(),
    label: 'Ät vitaminer',
    status: 'todo',
    swimlane: 'dailies',
    index: 2,
  },
  {
    id: new ObjectId().toString(),
    label: 'Handla',
    status: 'done',
    swimlane: 'weeklies',
    index: 0,
  },
  {
    id: new ObjectId().toString(),
    label: 'Pissa på valfri kyrka',
    status: 'done',
    swimlane: 'weeklies',
    index: 1,
  },
  {
    id: new ObjectId().toString(),
    label: 'Betala räkningar',
    status: 'todo',
    swimlane: 'monthlies',
    index: 0,
  },
  {
    id: new ObjectId().toString(),
    label: 'Lämna in arbetsgivardeklaration',
    status: 'todo',
    swimlane: 'monthlies',
    index: 1,
  },
  {
    id: new ObjectId().toString(),
    label: 'Fixa uppdrag',
    status: 'todo',
    swimlane: 'singles',
    index: 0,
  },
];
