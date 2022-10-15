import type { PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import { TasksState } from './interfaces';
import { StatusId, SwimlaneId } from '/types';
import { findTask } from '~/utils';

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

export const renameTask = (
  state: TasksState,
  action: PayloadAction<{
    id: string;
    label: string;
  }>
) => {
  const { id, label } = action.payload;
  const targetTask = findTask(state, id);
  targetTask.label = label;
};

export const deleteTask = (
  state: TasksState,
  action: PayloadAction<{
    id: string;
  }>
) => {
  const { id } = action.payload;
  const targetTask = findTask(state, id);
  const targetStatus =
    state.swimlanes[targetTask.swimlane].statuses[targetTask.status];
  targetStatus.tasks = targetStatus.tasks.filter((task) => task.id !== id);
};
