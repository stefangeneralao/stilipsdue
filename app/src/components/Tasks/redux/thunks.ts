import { createAsyncThunk } from '@reduxjs/toolkit';
import { DropResult } from 'react-beautiful-dnd';
import { apiSlice } from '~/components/Api/apiSlice';
import { RootState, store } from '~/store';
import { compareIndex, diffTasks } from '~/utils';
import { TasksState } from './interfaces';
import { StatusId, statusIds, SwimlaneId, swimlaneIds, Task } from '/types';

export const reorderTasks = createAsyncThunk<
  { tasks: TasksState },
  { dropResult: DropResult },
  { state: RootState }
>('tasks/reorderTasks', async (payload, thunkAPI) => {
  const state = thunkAPI.getState();
  const {
    tasks,
    tasks: { swimlanes },
  } = structuredClone(state);
  const dropResult = payload.dropResult;

  const { draggableId, destination, source } = dropResult;
  if (!destination) return { tasks };

  const draggedTask = Object.values(swimlanes)
    .map((swimlane) => Object.values(swimlane.statuses))
    .flat()
    .map((status) => status.tasks)
    .flat()
    .find((task) => task.id === draggableId);

  // Task was dropped outside of droppable.
  if (!draggedTask) return { tasks };

  const { index: destinationIndex, droppableId: destinationDroppableId } =
    destination;
  const { index: sourceIndex, droppableId: sourceDroppableId } = source;

  // Task was dropped at same location.
  if (
    destinationIndex === sourceIndex &&
    destinationDroppableId === sourceDroppableId
  )
    return { tasks };

  const destinationSwimlaneId = destinationDroppableId
    .split('-')[0]
    .split(':')[1] as SwimlaneId;
  const destinationStatusId = destinationDroppableId
    .split('-')[1]
    .split(':')[1] as StatusId;
  const sourceSwimlaneId = sourceDroppableId
    .split('-')[0]
    .split(':')[1] as SwimlaneId;
  const sourceStatusId = sourceDroppableId
    .split('-')[1]
    .split(':')[1] as StatusId;

  // Task was dropped in the same list, swimlane and status
  if (destinationDroppableId === sourceDroppableId) {
    const destinationList = swimlanes[destinationSwimlaneId].statuses[
      destinationStatusId
    ].tasks
      .filter((task: Task) => task.id !== draggableId)
      .sort(compareIndex);

    destinationList.splice(destinationIndex, 0, draggedTask);

    const destinationListAdjustedIndex = destinationList.map(
      (task: Task, index: number) => ({
        ...task,
        index,
      })
    );

    const newTasks = structuredClone(state.tasks);
    newTasks.swimlanes[destinationSwimlaneId].statuses[
      destinationStatusId
    ].tasks = destinationListAdjustedIndex;

    const updatedTasks = swimlaneIds.flatMap((swimlaneId) =>
      statusIds.flatMap((statusId) => {
        const previousTasks =
          state.tasks.swimlanes[swimlaneId].statuses[statusId].tasks.slice();

        const currentTasks =
          newTasks.swimlanes[swimlaneId].statuses[statusId].tasks.slice();

        return diffTasks(previousTasks, currentTasks);
      })
    );
    store.dispatch(apiSlice.endpoints.updateTasks.initiate(updatedTasks));

    return { tasks: newTasks };
  }

  try {
    const previousDestinationList =
      swimlanes[destinationSwimlaneId].statuses[destinationStatusId].tasks;
    const previousSourceList =
      swimlanes[sourceSwimlaneId].statuses[sourceStatusId].tasks;

    const updatedTask: Task = {
      ...draggedTask,
      status: destinationStatusId,
      swimlane: destinationSwimlaneId,
    };

    const currentDestinationList = structuredClone(previousDestinationList);
    const currentSourceList = structuredClone(previousSourceList);
    currentDestinationList.splice(destinationIndex, 0, updatedTask);
    currentSourceList.splice(sourceIndex, 1);

    const destinationListAdjustedIndex = currentDestinationList.map(
      (task, index) => ({
        ...task,
        index,
      })
    );
    const sourceListAdjustedIndex = currentSourceList.map((task, index) => ({
      ...task,
      index,
    }));

    const updatedTasks = diffTasks(
      [...previousDestinationList, ...previousSourceList],
      [...destinationListAdjustedIndex, ...sourceListAdjustedIndex]
    );

    store.dispatch(apiSlice.endpoints.updateTasks.initiate(updatedTasks));

    const newTasks = structuredClone(state.tasks);
    newTasks.swimlanes[destinationSwimlaneId].statuses[
      destinationStatusId
    ].tasks = destinationListAdjustedIndex;
    newTasks.swimlanes[sourceSwimlaneId].statuses[sourceStatusId].tasks =
      sourceListAdjustedIndex;

    return { tasks: newTasks };
  } catch (error) {
    console.error(error);
  }

  return { tasks };
});
