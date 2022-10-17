import styled from 'styled-components';
import StrictModeDroppable from '~/components/StrictModeDroppable';
import Task from '~/components/Tasks/Task';
import NewTaskField from '~/components/NewTaskField';
import { StatusId, SwimlaneId, Task as TaskType } from '/types';
import { Draggable } from 'react-beautiful-dnd';
import { getFriendlyName } from '~/utils';

const StyledStatusColumn = styled.div`
  display: grid;
  grid-template-rows: min-content auto;
  height: 100%;
  padding: 0px;
  grid-gap: 2px;
`;

const ColumnTitle = styled.h3`
  padding-left: 15px;
  margin: 0px 10px;
  border-bottom: solid #ddd 1px;
`;

const TaskList = styled.div<{ isDraggingOver: boolean }>`
  background-color: ${(props) =>
    props.isDraggingOver ? '#a9a28e' : 'transparent'};
  transition: 300ms;
  padding: 10px;
`;

const TaskContainer = styled.div`
  padding: 1px 0;
`;

const NewTaskFieldContainer = styled.div`
  height: 30px;
`;

interface Props {
  status: StatusId;
  swimlaneId: SwimlaneId;
  tasks: TaskType[];
}

const StatusColumn = ({ status, swimlaneId, tasks }: Props) => (
  <StrictModeDroppable droppableId={`swimlane:${swimlaneId}-status:${status}`}>
    {(provided, snapshot) => (
      <StyledStatusColumn>
        <ColumnTitle>{getFriendlyName(status)}</ColumnTitle>

        <TaskList
          isDraggingOver={snapshot.isDraggingOver}
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {tasks.map((task) => (
            <Draggable draggableId={task.id} index={task.index} key={task.id}>
              {(provided, snapshot) => (
                <TaskContainer
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <Task
                    label={task.label}
                    isDragging={snapshot.isDragging}
                    id={task.id}
                    statusId={status}
                  />
                </TaskContainer>
              )}
            </Draggable>
          ))}
          <NewTaskFieldContainer>
            {!snapshot.isDraggingOver && (
              <NewTaskField swimlaneId={swimlaneId} statusId={status} />
            )}
          </NewTaskFieldContainer>
          {provided.placeholder}
        </TaskList>
      </StyledStatusColumn>
    )}
  </StrictModeDroppable>
);

export default StatusColumn;
