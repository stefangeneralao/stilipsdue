import { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useUpdateTasksMutation } from '~/components/Api/apiSlice';
import { renameTask } from './redux/tasksSlice';
import { StatusId } from '/types';

const StyledTask = styled.div<{ isDragging: boolean; lineThrough: boolean }>`
  background-color: white;
  display: flex;
  align-items: center;
  box-shadow: ${(props) =>
    props.isDragging ? '0 2px 5px #00000033' : '0 1px 2px #00000033'};

  cursor: grab;
  text-decoration: ${(props) => (props.lineThrough ? 'line-through' : 'none')};
`;

const Label = styled.p`
  padding: 12px 15px;
  margin: 0;
  line-height: normal;
`;

const Form = styled.form`
  padding: 0;
  margin: 0;
  border: 0;
  width: 100%;
`;

const Input = styled.input`
  outline: none;
  border: 0;
  margin: 0;
  padding: 12px 15px;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  width: 100%;
  box-sizing: border-box;

  :focus {
    box-shadow: 0 1px 2px #3157ff;
    background-color: white;
    transition: 100ms;
  }
`;

interface Props {
  id: string;
  label: string;
  isDragging: boolean;
  statusId: StatusId;
}

const Task = ({ label, isDragging, id, statusId }: Props) => {
  const [inputValue, setInputValue] = useState(label);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const [updateTasksMutation] = useUpdateTasksMutation();

  const onClickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsEditing(true);
  };

  const onBlurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    dispatch(renameTask({ id, label: inputValue }));
    updateTasksMutation([{ id, label: inputValue }]);
    setIsEditing(false);
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.currentTarget.value);
  };

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(renameTask({ id, label: inputValue }));
    updateTasksMutation([{ id, label: inputValue }]);
    setIsEditing(false);
  };

  return (
    <StyledTask
      isDragging={isDragging}
      onClick={onClickHandler}
      lineThrough={statusId === 'done'}
    >
      {isEditing ? (
        <Form onSubmit={onSubmitHandler}>
          <Input
            onBlur={onBlurHandler}
            autoFocus
            value={inputValue}
            onChange={onChangeHandler}
          />
        </Form>
      ) : (
        <Label>{inputValue}</Label>
      )}
    </StyledTask>
  );
};

export default Task;
