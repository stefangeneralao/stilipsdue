import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import AuthenticationButton from '~/components/AuthenticationButton';
import logo from '~/assets/logo.svg'

const StyledProfile = styled.div`
  text-align: center;
  margin: auto;
  width: 100%;
  position: relative;
`;

const Img = styled.img``;

const H1 = styled.h1`
  margin: 20px;
`;

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();

  return (
    <StyledProfile>
      <AuthenticationButton>
        <Img src={logo} />
      </AuthenticationButton>
      {user && isAuthenticated && <H1>Let's go, {user.name}!</H1>}
    </StyledProfile>
  );
};

export default Profile;
