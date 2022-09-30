import { useAuth0 } from '@auth0/auth0-react';
import Profile from '~/components/Profile';
import Tasks from '~/components/Tasks';
import { sec } from '~/components/Api/security';
import './index.css';

function App() {
  const {
    getAccessTokenSilently,
    isAuthenticated,
    loginWithRedirect,
    isLoading,
  } = useAuth0();
  sec.setAccessTokenSilently(getAccessTokenSilently);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    loginWithRedirect();
    return null;
  }

  return (
    <div className="app">
      <Profile />
      <Tasks />
    </div>
  );
}

export default App;
