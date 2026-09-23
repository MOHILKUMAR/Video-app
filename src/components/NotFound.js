import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineVideocamOff } from "react-icons/md";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <MdOutlineVideocamOff size={64} className="text-muted" />
      <h1 className="mt-4 text-2xl font-bold">This page isn't available</h1>
      <p className="mt-2 text-muted">The link may be broken, or the page may have been removed.</p>
      <Link
        to="/"
        className="mt-6 rounded-full bg-fg px-5 py-2 text-sm font-medium text-app transition-opacity hover:opacity-85"
      >
        Go to home
      </Link>
    </div>
  );
};

export default NotFound;
