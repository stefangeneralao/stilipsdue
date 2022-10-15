import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from '~/components/Api/apiSlice';
import { initialState } from './constants';
import * as reducers from './reducers';
import { reorderTasks } from './thunks';

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers,
  extraReducers: (builder) => {
    builder.addCase(reorderTasks.fulfilled, (state, action) => {
      state.swimlanes = action.payload.tasks.swimlanes;
    });
    builder.addMatcher(
      apiSlice.endpoints.getTasks.matchFulfilled,
      (state, { payload }) => {
        state.swimlanes = payload.swimlanes;
      }
    );
  },
});

export const { addTask, renameTask, deleteTask } = tasksSlice.actions;

export default tasksSlice.reducer;
