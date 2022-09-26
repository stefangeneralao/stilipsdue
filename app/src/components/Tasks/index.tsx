import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { useGetTasksQuery } from '~/components/Api/apiSlice';
import { RootState } from '~/store';
import Swimlane from '~/components/Swimlane';
import { reorderTasks } from './redux/thunks';
import { SwimlaneId } from '/types';

const Tasks = () => {
  useGetTasksQuery();
  const swimlanes = useSelector((state: RootState) => state.tasks.swimlanes);

  const dispatch = useDispatch();

  const onDragEnd = (dropResult: DropResult) => {
    dispatch(reorderTasks({ dropResult }));
  };

  const Swimlanes = Object.entries(swimlanes).map(
    ([swimlaneId, swimlaneValue]) => (
      <Swimlane
        key={swimlaneId}
        id={swimlaneId as SwimlaneId}
        title={swimlaneValue.friendlyName}
        statuses={swimlaneValue.statuses}
      />
    )
  );

  return <DragDropContext onDragEnd={onDragEnd}>{Swimlanes}</DragDropContext>;
};

export default Tasks;
