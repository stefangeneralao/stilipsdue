import type { PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import { TasksState } from './interfaces';
import { StatusId, SwimlaneId } from '/types';

export const addTask = (
  state: TasksState,
  action: PayloadAction<{
    label: string;
    swimlaneId: SwimlaneId;
    statusId: StatusId;
  }>
) => {
  const { label, swimlaneId, statusId } = action.payload;

  state.swimlanes[swimlaneId].statuses[statusId].tasks = [
    ...state.swimlanes[swimlaneId].statuses[statusId].tasks,
    {
      id: uuid(),
      index: state.swimlanes[swimlaneId].statuses[statusId].tasks.length,
      label,
      status: statusId,
      swimlane: swimlaneId,
    },
  ];
};
