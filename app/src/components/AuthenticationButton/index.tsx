import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import styled from 'styled-components';

const StyledAuthenticationButton = styled.div`
  cursor: pointer;
`;

interface Props {
  children: React.ReactNode;
}

const AuthenticationButton = ({ children }: Props) => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  if (isAuthenticated) {
    return (
      <StyledAuthenticationButton
        onClick={() => logout({ returnTo: window.location.origin })}
      >
        {children}
      </StyledAuthenticationButton>
    );
  }
  return (
    <StyledAuthenticationButton onClick={() => loginWithRedirect()}>
      {children}
    </StyledAuthenticationButton>
  );
};

export default AuthenticationButton;
