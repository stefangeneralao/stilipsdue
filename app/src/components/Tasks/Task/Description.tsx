import styled from 'styled-components';

const DescriptionTextArea = styled.textarea`
  width: 100%;
  border: 0;
  margin: 10px 0;
  padding: 12px 15px;
  box-sizing: border-box;
  font-family: inherit;
  font-size: inherit;
  color: #222;
  outline: none;
  background-color: white;
  box-shadow: inset 0 -1px 2px #3d6d8a;
  resize: vertical;
  min-height: 100px;

  :focus {
    box-shadow: inset 0 -1px 2px #54b6f3;
    transition: 0ms;
  }

  @media (prefers-color-scheme: dark) {
    color: inherit;
    background-color: transparent;
  }
`;

const Form = styled.form`
  padding: 0;
  margin: 0;
  border: 0;
  width: 100%;
`;

interface Props {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  onBlur: React.FocusEventHandler<HTMLTextAreaElement>;
  value: string;
}

const Description = ({ onChange, value, onSubmit, onBlur }: Props) => (
  <Form onSubmit={onSubmit}>
    <DescriptionTextArea
      onChange={onChange}
      value={value}
      onBlur={onBlur}
      placeholder="Add a more detailed description..."
    />
  </Form>
);

export default Description;
