import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from '~/components/LoginButton';
import './Profile.css';

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();

  if (!user || !isAuthenticated) return null;

  return (
    <div className="profile">
      <h2>Hi {user.name}!</h2>
      <p>{user.email}</p>

      <LoginButton />
    </div>
  );
};

export default Profile;
