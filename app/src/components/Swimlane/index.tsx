import styled from 'styled-components';

import { ITodo, TSwimlane } from '/types';
import { columnKeys } from '~/constants';
import { groupTodosByStatus } from '~/utils';
import StatusColumn from '../StatusColumn';

const StyledSwimlane = styled.div`
  min-height: 300px;
  border-top: 5px dashed #920521;
  padding: 10px 0;
  margin: 20px 0;
`;

const StatusColumns = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 15px;

  height: 100%;
  min-width: 786px;
`;

const SwimlaneTitle = styled.h2`
  padding: 0 10px;
`;

interface Props {
  title: string;
  todos: ITodo[];
  id: TSwimlane;
}

const Swimlane = ({ title, todos, id }: Props) => {
  const todosGroupedByStatus = groupTodosByStatus(todos);

  return (
    <StyledSwimlane>
      <SwimlaneTitle>{title}</SwimlaneTitle>
      <StatusColumns>
        {columnKeys.map((columnKey) => (
          <StatusColumn
            key={columnKey}
            status={columnKey}
            swimlaneId={id}
            todos={todosGroupedByStatus[columnKey]}
          />
        ))}
      </StatusColumns>
    </StyledSwimlane>
  );
};

export default Swimlane;
