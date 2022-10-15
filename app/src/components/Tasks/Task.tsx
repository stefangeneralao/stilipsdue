import { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import Modal from '~/components/Modal';
import {
  useUpdateTasksMutation,
  useDeleteTaskMutation,
} from '~/components/Api/apiSlice';
import { deleteTask, renameTask } from './redux/tasksSlice';
import { StatusId } from '/types';
import DeleteTaskButton from '~/components/DeleteTaskButton';

const StyledTask = styled.div<{ isDragging: boolean; lineThrough: boolean }>`
  background-color: white;
  display: flex;
  align-items: center;
  box-shadow: ${(props) =>
    props.isDragging ? '0 2px 5px #00000033' : '0 1px 2px #00000033'};
  cursor: grab;
  text-decoration: ${(props) => (props.lineThrough ? 'line-through' : 'none')};
  transition: background-color 0.15s ease-in-out;

  &:hover {
    background-color: #f5f5f5;
    transition: background-color 0s ease-in-out;
  }
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
  width: 100%;
  border: 0;
  margin: 0;
  padding: 12px 15px;
  box-sizing: border-box;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  background-color: transparent;
  outline: none;
  transition: 200ms ease-in-out;

  :focus {
    background-color: white;
    box-shadow: inset 0 -1px 2px #3d6d8a;
    transition: 0ms;
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
  const dispatch = useDispatch();
  const [updateTasksMutation] = useUpdateTasksMutation();
  const [deleteTaskMutation] = useDeleteTaskMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClickHandler = () => setIsModalOpen(true);

  const onBlurHandler = () => {
    dispatch(renameTask({ id, label: inputValue }));
    updateTasksMutation([{ id, label: inputValue }]);
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(event.currentTarget.value);

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(renameTask({ id, label: inputValue }));
    updateTasksMutation([{ id, label: inputValue }]);
    setIsModalOpen(false);
  };

  const onRemoveHandler = () => {
    console.log('Removing task');
    dispatch(deleteTask({ id }));
    deleteTaskMutation(id);
  };

  return (
    <>
      <StyledTask
        isDragging={isDragging}
        onClick={onClickHandler}
        lineThrough={statusId === 'done'}
      >
        <Label>{inputValue}</Label>
      </StyledTask>

      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
        <Form onSubmit={onSubmitHandler}>
          <Input
            onBlur={onBlurHandler}
            value={inputValue}
            onChange={onChangeHandler}
          />
        </Form>
        <DeleteTaskButton onClick={onRemoveHandler} />
      </Modal>
    </>
  );
};

export default Task;
