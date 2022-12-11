import styled from 'styled-components';

const Form = styled.form`
  padding: 0;
  margin: 0;
  border: 0;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  border: 0;
  margin: 0;
  padding: 12px 15px;
  box-sizing: border-box;
  font-family: inherit;
  font-size: inherit;

  color: #222;
  background-color: white;
  outline: none;
  transition: 200ms ease-in-out;

  :focus {
    background-color: transparent;
    box-shadow: inset 0 -1px 2px #54b6f3;
    transition: 0ms;
  }

  @media (prefers-color-scheme: dark) {
    color: inherit;

    :focus {
      background-color: transparent;
    }
  }
`;

interface Props {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  value: string;
}

const Label = ({ onSubmit, onChange, value, onBlur }: Props) => (
  <Form onSubmit={onSubmit}>
    <Input onBlur={onBlur} value={value} onChange={onChange} />
  </Form>
);

export default Label;
