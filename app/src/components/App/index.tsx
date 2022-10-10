import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import Profile from '~/components/Profile';
import Tasks from '~/components/Tasks';
import { sec } from '~/components/Api/security';

const StyledApp = styled.div`
  max-width: 768px;
  margin: 40px auto;
  word-wrap: break-word;
`;

const App = () => {
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
    <StyledApp>
      <Profile />
      <Tasks />
    </StyledApp>
  );
};

export default App;
