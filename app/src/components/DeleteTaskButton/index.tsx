import styled from 'styled-components';

const Button = styled.button`
  background-color: #ffd7d7;
  border: 0;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 35px;
  transition: background-color 200ms ease-in-out;
  float: right;
  border-radius: 2px;

  &:hover {
    background-color: #ffb8b8;
    transition: background-color 100ms ease-in-out;
  }

  &:focus {
    outline: none;
  }
`;

const ButtonText = styled.p`
  font-size: 12px;
  font-weight: bold;
  margin: 0;
  padding: 20px;
`;

interface Props {
  onClick: () => void;
}

const DeleteTaskButton = ({ onClick }: Props) => {
  return (
    <Button onClick={onClick}>
      <ButtonText>REMOVE</ButtonText>
    </Button>
  );
};

export default DeleteTaskButton;
