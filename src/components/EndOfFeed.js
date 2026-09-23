import React from "react";
import { MdOutlineCheckCircle } from "react-icons/md";

// Shown after the last page of an infinite-scroll list.
const EndOfFeed = ({ title, message }) => (
  <div className="mt-12 flex flex-col items-center gap-2 text-center">
    <MdOutlineCheckCircle size={40} className="text-muted" />
    <p className="font-medium">{title}</p>
    <p className="text-sm text-muted">{message}</p>
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="mt-2 rounded-full bg-surface px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-hover"
    >
      Back to top
    </button>
  </div>
);

export default EndOfFeed;
