import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaGithub } from "react-icons/fa";
import {
  MdHomeFilled,
  MdOutlineDirectionsCar,
  MdOutlineEmojiEvents,
  MdOutlineLightbulb,
  MdOutlineMovie,
  MdOutlineMusicNote,
  MdOutlineNewspaper,
  MdOutlinePets,
  MdOutlineSentimentVerySatisfied,
  MdOutlineSpa,
  MdOutlineSportsEsports,
  MdOutlineTheaters,
} from "react-icons/md";
import { closeDrawer } from "../utils/appSlice";
import {
  CATEGORIES,
  REPO_URL,
  getCategory,
  getCategoryPath,
} from "../utils/constants";
import IconButton from "./IconButton";
import Logo from "./Logo";

const CATEGORY_ICONS = {
  music: MdOutlineMusicNote,
  gaming: MdOutlineSportsEsports,
  sports: MdOutlineEmojiEvents,
  news: MdOutlineNewspaper,
  entertainment: MdOutlineTheaters,
  comedy: MdOutlineSentimentVerySatisfied,
  tech: MdOutlineLightbulb,
  movies: MdOutlineMovie,
  lifestyle: MdOutlineSpa,
  autos: MdOutlineDirectionsCar,
  pets: MdOutlinePets,
};

const HOME = { slug: "all", label: "Home", icon: MdHomeFilled, to: "/" };
const EXPLORE = CATEGORIES.filter((c) => c.slug !== "all").map((c) => ({
  slug: c.slug,
  label: c.label,
  icon: CATEGORY_ICONS[c.slug],
  to: getCategoryPath(c.slug),
}));

// The category shown on the home page, or null on other pages.
const useActiveSlug = () => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  return pathname === "/" ? getCategory(searchParams.get("category")).slug : null;
};

const NavItem = ({ item, isActive }) => (
  <Link
    to={item.to}
    aria-current={isActive ? "page" : undefined}
    className={`flex items-center gap-5 rounded-lg px-3 py-2 text-sm transition-colors ${
      isActive ? "bg-surface font-medium hover:bg-surface-hover" : "hover:bg-surface"
    }`}
  >
    <item.icon size={22} className="shrink-0" />
    <span className="truncate">{item.label}</span>
  </Link>
);

const FullNav = () => {
  const activeSlug = useActiveSlug();
  return (
    <nav aria-label="Main" className="p-3">
      <NavItem item={HOME} isActive={activeSlug === "all"} />
      <hr className="my-3 border-line" />
      <h2 className="px-3 pb-1 font-medium">Explore</h2>
      {EXPLORE.map((item) => (
        <NavItem key={item.slug} item={item} isActive={activeSlug === item.slug} />
      ))}
      <hr className="my-3 border-line" />
      <a
        href={REPO_URL}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-surface"
      >
        <FaGithub size={20} className="shrink-0" />
        <span>Source code</span>
      </a>
    </nav>
  );
};

// Icon-only rail: tablets, and desktop when the menu is collapsed.
const MiniNav = () => {
  const activeSlug = useActiveSlug();
  return (
    <nav aria-label="Main" className="flex w-18 flex-col gap-1 px-1 py-2">
      {[HOME, ...EXPLORE.slice(0, 4)].map((item) => (
        <Link
          key={item.slug}
          to={item.to}
          aria-current={activeSlug === item.slug ? "page" : undefined}
          className={`flex flex-col items-center gap-1.5 rounded-lg px-1 py-4 text-[10px] transition-colors hover:bg-surface ${
            activeSlug === item.slug ? "font-medium" : ""
          }`}
        >
          <item.icon size={24} />
          <span className="max-w-full truncate">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

// Docked sidebar, hidden on phones.
const Sidebar = () => {
  const isMenuOpen = useSelector((store) => store.app.isMenuOpen);

  return (
    <aside className="no-scrollbar sticky top-14 hidden h-[calc(100dvh-3.5rem)] shrink-0 overflow-y-auto md:block">
      <div className={isMenuOpen ? "lg:hidden" : ""}>
        <MiniNav />
      </div>
      {isMenuOpen && (
        <div className="hidden w-60 lg:block">
          <FullNav />
        </div>
      )}
    </aside>
  );
};

// Slide-in overlay used on phones, tablets and the watch page.
export const SidebarDrawer = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((store) => store.app.isDrawerOpen);
  const close = () => dispatch(closeDrawer());

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") dispatch(closeDrawer());
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, dispatch]);

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
      inert={!isOpen}
    >
      <div
        onClick={close}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        // Close after following any link, even one to the current page.
        onClick={(e) => e.target.closest("a") && close()}
        // Shadow only when open, or it peeks in from the left edge.
        className={`no-scrollbar absolute inset-y-0 left-0 w-64 overflow-y-auto bg-app transition-transform duration-200 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center gap-1 px-2 sm:gap-3 sm:px-4">
          <IconButton label="Close menu" onClick={close}>
            <RxHamburgerMenu size={22} />
          </IconButton>
          <Logo />
        </div>
        <FullNav />
      </div>
    </div>
  );
};

export default Sidebar;
