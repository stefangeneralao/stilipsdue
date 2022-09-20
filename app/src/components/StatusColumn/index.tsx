import styled from 'styled-components';
import StrictModeDroppable from '~/components/StrictModeDroppable';
import { columns } from '~/constants';
import Todo from '~/components/Todo';
import NewTodoField from '~/components/NewTodoField';
import { ITodo, TSwimlane, TTodoStatus } from '/types';

const StyledStatusColumn = styled.div`
  display: grid;
  grid-template-rows: min-content min-content auto;
  height: 100%;
  padding: 10px;
`;

const ColumnTitle = styled.h3`
  padding: 10px 15px;
  border-bottom: solid #ddd 1px;
`;

const TodoList = styled.div<{ isDraggingOver: boolean }>`
  background-color: ${(props) =>
    props.isDraggingOver ? '#a9a28e' : 'transparent'};
  transition: 300ms;
`;

const DroppableContainer = styled.div`
  height: 100%;
`;

interface Props {
  status: TTodoStatus;
  swimlaneId: TSwimlane;
  todos: ITodo[];
}

const StatusColumn = ({ status, swimlaneId, todos }: Props) => {
  return (
    <StrictModeDroppable
      droppableId={`swimlane:${swimlaneId}-status:${status}`}
    >
      {(provided, snapshot) => (
        <StyledStatusColumn>
          <ColumnTitle>{columns[status].friendlyName}</ColumnTitle>
          <>
            <DroppableContainer>
              <NewTodoField swimlaneId={swimlaneId} status={status} />
              <TodoList
                isDraggingOver={snapshot.isDraggingOver}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {todos.map((todo) => (
                  <Todo
                    key={todo.id}
                    id={todo.id}
                    index={todo.index}
                    label={todo.label}
                  />
                ))}
                {provided.placeholder}
              </TodoList>
            </DroppableContainer>
          </>
        </StyledStatusColumn>
      )}
    </StrictModeDroppable>
  );
};

export default StatusColumn;
