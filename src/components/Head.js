import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaUserCircle } from "react-icons/fa";
import { IoArrowBack, IoSearchOutline } from "react-icons/io5";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { setTheme, toggleDrawer, toggleMenu } from "../utils/appSlice";
import useMediaQuery from "../utils/useMediaQuery";
import ApiKeyCounter from "./ApiKeyCounter";
import IconButton from "./IconButton";
import Logo from "./Logo";
import SearchBar from "./SearchBar";

const Head = () => {
  const dispatch = useDispatch();
  const theme = useSelector((store) => store.app.theme);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { pathname } = useLocation();
  // Phones: the search icon swaps the header for a full-width search bar.
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleMenuClick = () => {
    // Desktop pages have a docked sidebar; everywhere else it's a drawer.
    if (isDesktop && pathname !== "/watch") dispatch(toggleMenu());
    else dispatch(toggleDrawer());
  };

  const handleThemeClick = () => {
    const next = theme === "dark" ? "light" : "dark";
    dispatch(setTheme(next));
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be blocked (private mode); the toggle still works.
    }
  };

  const hideOnMobileSearch = isMobileSearchOpen ? "hidden md:flex" : "flex";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 bg-app/90 px-2 backdrop-blur-md sm:gap-4 sm:px-4">
      <div className={`${hideOnMobileSearch} shrink-0 items-center gap-1 sm:gap-3`}>
        <IconButton label="Menu" onClick={handleMenuClick}>
          <RxHamburgerMenu size={22} />
        </IconButton>
        <Logo />
      </div>

      <div
        className={`${
          isMobileSearchOpen ? "flex" : "hidden md:flex"
        } min-w-0 flex-1 items-center justify-center gap-2`}
      >
        <IconButton
          label="Close search"
          className="md:hidden"
          onClick={() => setIsMobileSearchOpen(false)}
        >
          <IoArrowBack size={22} />
        </IconButton>
        <SearchBar
          autoFocus={isMobileSearchOpen}
          onSearch={() => setIsMobileSearchOpen(false)}
        />
      </div>

      <div className={`${hideOnMobileSearch} shrink-0 items-center gap-1 sm:gap-2`}>
        <ApiKeyCounter />
        <IconButton
          label="Search"
          className="md:hidden"
          onClick={() => setIsMobileSearchOpen(true)}
        >
          <IoSearchOutline size={22} />
        </IconButton>
        <IconButton
          label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          onClick={handleThemeClick}
        >
          {theme === "dark" ? (
            <MdOutlineLightMode size={22} />
          ) : (
            <MdOutlineDarkMode size={22} />
          )}
        </IconButton>
        {/* Decorative, so phones drop it to make room for the API badge. */}
        <FaUserCircle
          size={32}
          className="ml-1 hidden text-muted sm:block"
          aria-hidden="true"
        />
      </div>
    </header>
  );
};

export default Head;
