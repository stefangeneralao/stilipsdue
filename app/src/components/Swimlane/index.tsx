import styled from 'styled-components';
import { SwimlaneId, statusIds } from '/types';
import StatusColumn from '~/components/StatusColumn';
import { Status } from '~/components/Tasks/redux/interfaces';
import { StatusId } from '/types';

const StyledSwimlane = styled.div`
  min-height: 300px;
  max-width: 768px;
  border-top: 5px dashed #920521;
  padding: 10px 0;
  margin: 20px auto;
`;

const StatusColumns = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 100%;
  width: 768px;
`;

const SwimlaneTitle = styled.h2`
  padding: 0 10px;
`;

const ScrollBox = styled.div`
  overflow-x: scroll;
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
      <ScrollBox>
        <StatusColumns>
          {statusIds.map((statusId) => (
            <StatusColumn
              key={statusId}
              status={statusId}
              swimlaneId={id}
              tasks={statuses[statusId].tasks}
            />
          ))}
        </StatusColumns>
      </ScrollBox>
    </StyledSwimlane>
  );
};

export default Swimlane;
