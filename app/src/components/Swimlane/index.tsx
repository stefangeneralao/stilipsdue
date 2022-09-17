import styled from 'styled-components';

import { ITodo } from '~/types';
import StrictModeDroppable from '~/components/StrictModeDroppable';
import Todo from '~/components/Todo';
import { columnKeys, columns } from '~/constants';
import { groupTodosByStatus } from '~/utils';

const StyledSwimlane = styled.div`
  min-height: 300px;
  border-top: 5px dashed #920521;
  padding: 10px 0;
  margin: 20px 0;
`;

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 15px;

  height: 100%;
  min-width: 786px;
`;

const ColumnTitle = styled.h3`
  padding: 10px 15px;
  margin: 10px;
  border-bottom: solid #ddd 1px;
`;

const TodoList = styled.div<{ isDraggingOver: boolean }>`
  background-color: ${(props) =>
    props.isDraggingOver ? '#a9a28e' : 'transparent'};
  transition: 300ms;
  height: 100%;
  padding: 10px;
`;

const Column = styled.div`
  display: grid;
  grid-template-rows: min-content auto;
  height: 100%;
`;

const SwimlaneTitle = styled.h2`
  padding: 0 10px;
`;

interface Props {
  title: string;
  todos: ITodo[];
  id: string;
}

const Swimlane = ({ title, todos, id }: Props) => {
  return (
    <StyledSwimlane>
      <SwimlaneTitle>{title}</SwimlaneTitle>
      <Columns>
        {columnKeys.map((columnKey) => (
          <Column key={columnKey}>
            <ColumnTitle>{columns[columnKey].friendlyName}</ColumnTitle>
            <StrictModeDroppable
              droppableId={`swimlane:${id}-status:${columnKey}`}
            >
              {(provided, snapshot) => (
                <>
                  <TodoList
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    isDraggingOver={snapshot.isDraggingOver}
                  >
                    {groupTodosByStatus(todos)[columnKey].map((todo) => (
                      <Todo
                        key={todo.id}
                        id={todo.id}
                        index={todo.index}
                        label={todo.label}
                      />
                    ))}
                    {provided.placeholder}
                  </TodoList>
                </>
              )}
            </StrictModeDroppable>
          </Column>
        ))}
      </Columns>
    </StyledSwimlane>
  );
};

export default Swimlane;
