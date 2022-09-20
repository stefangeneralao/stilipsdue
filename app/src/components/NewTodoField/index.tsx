import { useState } from 'react';
import styled from 'styled-components';
import { useTodos } from '~/context/todos';
import { TSwimlane, TTodoStatus } from '/types';

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

  height: 48px;
  padding: 12px 15px;

  &:placeholder-shown {
    text-align: center;
  }

  :focus,
  :hover {
    box-shadow: 0 1px 5px #f85353;
    background-color: white;
    transition: 100ms;
  }
`;

interface Props {
  swimlaneId: TSwimlane;
  status: TTodoStatus;
}

const NewTodoField = ({ swimlaneId, status }: Props) => {
  const { addTodo } = useTodos();

  const [inputValue, setInputValue] = useState<string>('');

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputValue || inputValue.length === 0) return;
    addTodo(inputValue, swimlaneId, status);
    setInputValue('');
  };

  const onBlurHandler = () => {
    if (!inputValue || inputValue.length === 0) return;
    addTodo(inputValue, swimlaneId, status);
    setInputValue('');
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.currentTarget.value);
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

export default NewTodoField;
