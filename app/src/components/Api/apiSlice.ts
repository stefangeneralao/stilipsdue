import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TasksState } from '~/components/Tasks/redux/interfaces';
import { groupBySwimlaneAndStatus } from '~/utils';
import { Task } from '/types';
import { sec } from './security';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001/',
    prepareHeaders: async (headers) => {
      const access_token = await sec.getAccessTokenSilently()();
      if (access_token) {
        headers.set('Authorization', `Bearer ${access_token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Tasks'],
  endpoints: (builder) => ({
    getTasks: builder.query<TasksState, void>({
      query: () => '/tasks',
      transformResponse: (rawResult: { tasks: Task[] }) =>
        groupBySwimlaneAndStatus(rawResult.tasks),
      providesTags: ['Tasks'],
    }),
    addNewTask: builder.mutation({
      query: (task) => ({
        url: '/tasks',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: ['Tasks'],
    }),
    updateTasks: builder.mutation({
      query: (tasks: Task[]) => ({
        url: '/tasks',
        method: 'PATCH',
        body: tasks,
      }),
      invalidatesTags: ['Tasks'],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useAddNewTaskMutation,
  useUpdateTasksMutation,
} = apiSlice;
