import ReactModal from 'react-modal';

const modalStyleDarkTheme = {
  overlay: {
    backgroundColor: '#000000a3',
    backdropFilter: 'blur(2px) saturate(0.5)',
  },
  content: {
    maxWidth: '500px',
    margin: 'auto',
    padding: '30px',
    backgroundColor: '#222',
    height: 'min-content',
    borderRadius: '2px',
    border: 'none',
  },
};

const modalStyleLightTheme = {
  ...modalStyleDarkTheme,
  content: {
    ...modalStyleDarkTheme.content,
    backgroundColor: '#fafafa',
  },
};

const isDarkTheme =
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

const modalStyle = isDarkTheme ? modalStyleDarkTheme : modalStyleLightTheme;

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onRequestClose, children }: Props) => (
  <ReactModal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    ariaHideApp={false}
    style={modalStyle}
    closeTimeoutMS={200}
  >
    {children}
  </ReactModal>
);

export default Modal;
