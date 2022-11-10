import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '~/store';
import { useAddNewTaskMutation } from '~/components/Api/apiSlice';
import { addTask } from '~/components/Tasks/redux/tasksSlice';
import { StatusId, SwimlaneId } from '/types';

const Form = styled.form`
  margin-bottom: 2px;
`;

const Input = styled.input`
  background-color: transparent;
  display: flex;
  align-items: center;
  border: 0;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  font-family: inherit;
  font-size: inherit;
  transition: 300ms;
  text-align: left;

  height: 30px;
  padding: 12px 15px;

  &:placeholder-shown {
    text-align: center;
  }

  :focus {
    box-shadow: 0 1px 2px #3157ff;
    background-color: white;
    transition: 100ms;
    height: 48px;
  }
`;

interface Props {
  swimlaneId: SwimlaneId;
  statusId: StatusId;
}

const NewTaskField = ({ swimlaneId, statusId }: Props) => {
  const dispatch = useDispatch();
  const [addNewTask] = useAddNewTaskMutation();
  const tasks = useSelector((state: RootState) => state.tasks);

  const [inputValue, setInputValue] = useState<string>('');

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitNewTask();
  };

  const onBlurHandler = () => submitNewTask();

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(event.currentTarget.value);

  const submitNewTask = () => {
    if (!inputValue || inputValue.length === 0) return;
    dispatch(addTask({ label: inputValue, swimlaneId, statusId }));
    addNewTask({
      label: inputValue,
      swimlane: swimlaneId,
      status: statusId,
      index: tasks.swimlanes[swimlaneId].statuses[statusId].tasks.length,
    });
    setInputValue('');
  };

  return (
    <Form onSubmit={onSubmitHandler}>
      <Input
        placeholder="+"
        onBlur={onBlurHandler}
        onChange={onChangeHandler}
        value={inputValue}
      />
    </Form>
  );
};

export default NewTaskField;
