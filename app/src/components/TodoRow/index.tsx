import { ITodo } from '~/types';

interface Props {
  title: string;
  todos: ITodo[];
}

const TodoRow = ({ title, todos }: Props) => {
  return (
    <div>
      <h3>{title}</h3>
      {todos.map((todo) => (
        <p key={todo.id}>{todo.label}</p>
      ))}
    </div>
  );
};

export default TodoRow;
