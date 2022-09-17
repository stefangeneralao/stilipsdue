import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import { useTodos } from '~/hooks/todos';
import Swimlane from '~/components/Swimlane';

const Todos = () => {
  const { todos, isLoading, reorderTodos, isAuthenticated } = useTodos();

  const onDragEnd = (result: DropResult) => {
    reorderTodos(result);
  };

  if (!isAuthenticated) return null;

  if (isLoading) return <p>Loading todos...</p>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Swimlane id="dailies" title="Dailies" todos={todos.dailies} />
      <Swimlane id="weeklies" title="Weeklies" todos={todos.weeklies} />
      <Swimlane id="monthlies" title="Monthlies" todos={todos.monthlies} />
      <Swimlane id="singles" title="Singles" todos={todos.singles} />
    </DragDropContext>
  );
};

export default Todos;
