import React from "react";

const IconButton = ({ label, className = "", children, ...props }) => {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-surface active:bg-surface-hover ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;
