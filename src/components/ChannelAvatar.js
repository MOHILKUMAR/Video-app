import React, { useState } from "react";

const COLORS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-sky-500",
  "bg-indigo-500",
  "bg-fuchsia-500",
];

// Channel picture from the API, or the channel's first letter as a fallback.
const ChannelAvatar = ({ name = "", src, size = "size-9" }) => {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={`${size} shrink-0 rounded-full bg-surface object-cover`}
      />
    );
  }

  const hash = [...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return (
    <div
      aria-hidden="true"
      className={`${size} ${COLORS[hash % COLORS.length]} flex shrink-0 items-center justify-center rounded-full text-sm font-medium text-white`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
};

export default ChannelAvatar;
