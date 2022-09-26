import styled from 'styled-components';
import StrictModeDroppable from '~/components/StrictModeDroppable';
import { columns } from '~/constants';
import Task from '~/components/Task';
import NewTaskField from '~/components/NewTaskField';
import { StatusId, SwimlaneId, Task as TaskType } from '/types';

const StyledStatusColumn = styled.div`
  display: grid;
  grid-template-rows: min-content min-content auto;
  height: 100%;
  padding: 10px;
`;

const ColumnTitle = styled.h3`
  padding: 10px 15px;
  border-bottom: solid #ddd 1px;
  margin-bottom: 5px;
`;

const TaskList = styled.div<{ isDraggingOver: boolean }>`
  background-color: ${(props) =>
    props.isDraggingOver ? '#a9a28e' : 'transparent'};
  transition: 300ms;
`;

const DroppableContainer = styled.div`
  height: 100%;
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
        <ColumnTitle>{columns[status].friendlyName}</ColumnTitle>
        <DroppableContainer>
          <TaskList
            isDraggingOver={snapshot.isDraggingOver}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {tasks.map((task) => (
              <Task
                key={task.id}
                id={task.id}
                index={task.index}
                label={task.label}
              />
            ))}
            <NewTaskField swimlaneId={swimlaneId} statusId={status} />
            {provided.placeholder}
          </TaskList>
        </DroppableContainer>
      </StyledStatusColumn>
    )}
  </StrictModeDroppable>
);

export default StatusColumn;
