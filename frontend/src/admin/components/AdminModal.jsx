import React from 'react';

export default function AdminModal({ children, onClose }) {
  return (
    <div
      className='modal-backdrop'
      onClick={onClose}>
      <div
        className='modal'
        onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
