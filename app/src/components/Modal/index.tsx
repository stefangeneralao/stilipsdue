import ReactModal from 'react-modal';

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
    style={{
      overlay: {
        backgroundColor: '#000000a3',
        backdropFilter: 'blur(2px) saturate(0.5)',
      },
      content: {
        maxWidth: '500px',
        margin: 'auto',
        padding: '30px',
        backgroundColor: '#fafafa',
        height: 'min-content',
        borderRadius: '2px',
        border: 'none',
      },
    }}
    closeTimeoutMS={200}
  >
    {children}
  </ReactModal>
);

export default Modal;
