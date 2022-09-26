import { useAuth0 } from '@auth0/auth0-react';
import Profile from '~/components/Profile';
import Tasks from '~/components/Tasks';
import { sec } from '~/components/Api/security';
import './index.css';

function App() {
  const { getAccessTokenSilently } = useAuth0();
  sec.setAccessTokenSilently(getAccessTokenSilently);

  return (
    <div className="app">
      <Profile />
      <Tasks />
    </div>
  );
}

export default App;
