import React from "react";
import { Link } from "react-router-dom";
import { FaYoutube } from "react-icons/fa";

const Logo = () => {
  return (
    <Link
      to="/"
      aria-label="VideoApp home"
      className="flex shrink-0 items-center gap-1 rounded-lg px-1"
    >
      <FaYoutube size={30} className="text-red-600" />
      <span className="text-lg font-bold tracking-tighter">VideoApp</span>
    </Link>
  );
};

export default Logo;
