import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import css from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

const Modal = ({ onClose, onClick, url }) => {
  useEffect(() => {
    const handleKeydown = e => {
      if (e.code === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [onClose]);

  const handleBackdrope = e => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  return createPortal(
    <div className={css.overlay} onClick={handleBackdrope}>
      <div className={css.modal}>
        <button type="button" onClick={onClick}>
          CLOSE X
        </button>
        <img src={url} alt={url} />
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
};
