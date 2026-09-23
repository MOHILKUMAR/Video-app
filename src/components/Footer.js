import React from "react";
import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { MdOutlineCode } from "react-icons/md";
import { CATEGORIES, REPO_URL, getCategoryPath } from "../utils/constants";
import Logo from "./Logo";

const FOOTER_CATEGORIES = CATEGORIES.filter((c) => c.slug !== "all").slice(0, 6);

const Footer = () => {
  return (
    <footer className="mt-12 border-t border-line px-4 pt-10 pb-8 text-sm sm:px-6">
      <div className="grid gap-8 @xl:grid-cols-2 @4xl:grid-cols-4">
        <div className="@4xl:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-muted">
            Trending videos and search across YouTube, built with React, Redux
            Toolkit and Tailwind CSS.
          </p>
        </div>

        <div>
          <h2 className="mb-3 font-medium">Explore</h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-muted">
            {FOOTER_CATEGORIES.map(({ slug, label }) => (
              <li key={slug}>
                <Link to={getCategoryPath(slug)} className="hover:text-fg">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 font-medium">Resources</h2>
          <ul className="space-y-2 text-muted">
            <li>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-fg"
              >
                <FaGithub size={16} /> Source code
              </a>
            </li>
            <li>
              <a
                href="https://developers.google.com/youtube/v3"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-fg"
              >
                <MdOutlineCode size={16} /> YouTube Data API
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted @2xl:flex-row @2xl:justify-between">
        <p>© {new Date().getFullYear()} VideoApp</p>
        <p>Video data from the YouTube Data API. Not affiliated with YouTube or Google.</p>
      </div>
    </footer>
  );
};

export default Footer;
