import React from 'react';

const ButtonWithProgress = ({ onClick, pendingApiCall, disabled, text, className }) => {
  return (
    <button
      className={className || 'btn btn-primary'}
      onClick={onClick}
      disabled={disabled}
    >
      {pendingApiCall && <span className="spinner-border spinner-border-sm"></span>} {text}
    </button>
  );
};

export default ButtonWithProgress;
