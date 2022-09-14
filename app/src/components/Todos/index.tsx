import { useTodos } from '~/hooks/todos';
import TodoRow from '~/components/TodoRow';
import './todos.css';

const Todos = () => {
  const { todos, isLoading } = useTodos();

  if (isLoading) return <p>Loading todos...</p>;

  return (
    <div className="Todos">
      <TodoRow title="Dailies" todos={todos.dailies} />
      <TodoRow title="Weeklies" todos={todos.weeklies} />
      <TodoRow title="Monthlies" todos={todos.monthlies} />
      <TodoRow title="Singles" todos={todos.singles} />
    </div>
  );
};

export default Todos;
