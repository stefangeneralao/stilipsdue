import { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import Modal from '~/components/Modal';
import {
  useUpdateTasksMutation,
  useDeleteTaskMutation,
} from '~/components/Api/apiSlice';
import { deleteTask, renameTask } from '../redux/tasksSlice';
import { StatusId } from '/types';
import DeleteTaskButton from '~/components/DeleteTaskButton';
import Description from './Description';
import LabelInput from './Label';

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

interface Props {
  id: string;
  label: string;
  description: string;
  isDragging: boolean;
  statusId: StatusId;
}

const Task = ({
  label: initialLabel,
  description: initialDescription,
  isDragging,
  id,
  statusId,
}: Props) => {
  const [label, setLabel] = useState(initialLabel);
  const [description, setDescription] = useState(initialDescription);
  const dispatch = useDispatch();
  const [updateTasksMutation] = useUpdateTasksMutation();
  const [deleteTaskMutation] = useDeleteTaskMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClickHandler = () => setIsModalOpen(true);

  const onLabelChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setLabel(event.currentTarget.value);

  const onLabelSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (label === initialLabel) return;

    dispatch(renameTask({ id, label }));
    updateTasksMutation([{ id, label }]);
  };

  const onLabelBlur = () => {
    if (label === initialLabel) return;

    dispatch(renameTask({ id, label }));
    updateTasksMutation([{ id, label }]);
  };

  const onDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
    setDescription(event.currentTarget.value);

  const onDescriptionSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (description === initialDescription) return;

    updateTasksMutation([{ id, description }]);
  };

  const onDescriptionBlur = () => {
    if (description === initialDescription) return;

    updateTasksMutation([{ id, description }]);
  };

  const onRemoveHandler = () => {
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
        <Label>{label}</Label>
      </StyledTask>

      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
        <LabelInput
          value={label}
          onChange={onLabelChange}
          onSubmit={onLabelSubmit}
          onBlur={onLabelBlur}
        />
        <Description
          value={description}
          onChange={onDescriptionChange}
          onSubmit={onDescriptionSubmit}
          onBlur={onDescriptionBlur}
        />
        <DeleteTaskButton onClick={onRemoveHandler} />
      </Modal>
    </>
  );
};

export default Task;
