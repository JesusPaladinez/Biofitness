import React, { useEffect, useRef } from 'react';

const Dropdown = ({ open, onClose, children, className = '' }) => {
  const ref = useRef();

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div ref={ref} className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-30 ${className}`}>
      {children}
    </div>
  );
};

export default Dropdown; 