import './index.css';
import Profile from '~/components/Profile';
import Todos from '~/components/Todos';

function App() {
  return (
    <div className="app">
      <Profile />
      <Todos />
    </div>
  );
}

export default App;
