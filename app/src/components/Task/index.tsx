import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const StyledTask = styled.div<{ isDragging: boolean }>`
  background-color: white;
  display: flex;
  align-items: center;
  box-shadow: ${(props) =>
    props.isDragging ? '0 2px 5px #00000033' : '0 1px 2px #00000033'};
  margin-bottom: 2px;

  cursor: grab;
`;

const Label = styled.p`
  padding: 12px 15px;
  margin: 0;
`;

interface Props {
  label: string;
  id: string;
  index: number;
}

const Task = ({ label, id, index }: Props) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <StyledTask
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          <Label>{label}</Label>
        </StyledTask>
      )}
    </Draggable>
  );
};

export default Task;
