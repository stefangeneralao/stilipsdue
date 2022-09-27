import styled from 'styled-components';
import { SwimlaneId } from '/types';
import { columnKeys } from '~/constants';
import StatusColumn from '~/components/StatusColumn';
import { Status } from '~/components/Tasks/redux/interfaces';
import { StatusId } from '/types';

const StyledSwimlane = styled.div`
  min-height: 300px;
  border-top: 5px dashed #920521;
  padding: 10px 0;
  margin: 20px 0;
`;

const StatusColumns = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  height: 100%;
  min-width: 786px;
`;

const SwimlaneTitle = styled.h2`
  padding: 0 10px;
`;

interface Props {
  title: string;
  id: SwimlaneId;
  statuses: { [id in StatusId]: Status };
}

const Swimlane = ({ title, statuses, id }: Props) => {
  return (
    <StyledSwimlane>
      <SwimlaneTitle>{title}</SwimlaneTitle>
      <StatusColumns>
        {columnKeys.map((columnKey) => (
          <StatusColumn
            key={columnKey}
            status={columnKey}
            swimlaneId={id}
            tasks={statuses[columnKey].tasks}
          />
        ))}
      </StatusColumns>
    </StyledSwimlane>
  );
};

export default Swimlane;
