import React from "react";
import { MdErrorOutline } from "react-icons/md";

const ErrorMessage = ({ title, message, onRetry }) => {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 sm:flex-row sm:items-center"
    >
      <MdErrorOutline size={24} className="shrink-0 text-red-600 dark:text-red-400" />
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className="mt-0.5 text-sm text-muted">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full bg-fg px-4 py-2 text-sm font-medium text-app transition-opacity hover:opacity-85"
        >
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
