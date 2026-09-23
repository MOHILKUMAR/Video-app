import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { CATEGORIES, getCategory, getCategoryPath } from "../utils/constants";
import IconButton from "./IconButton";

const ButtonList = () => {
  const [searchParams] = useSearchParams();
  const activeSlug = getCategory(searchParams.get("category")).slug;
  const scrollerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  // Re-check when the chip row changes width (window resize, sidebar toggle).
  useEffect(() => {
    const observer = new ResizeObserver(updateArrows);
    observer.observe(scrollerRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollBy = (direction) =>
    scrollerRef.current.scrollBy({ left: direction * 240, behavior: "smooth" });

  return (
    <div className="sticky top-14 z-20 -mx-4 bg-app/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
      <div className="relative">
        <div
          ref={scrollerRef}
          onScroll={updateArrows}
          className="no-scrollbar flex gap-3 overflow-x-auto"
        >
          {CATEGORIES.map(({ slug, label }) => (
            <Link
              key={slug}
              to={getCategoryPath(slug)}
              aria-current={activeSlug === slug ? "page" : undefined}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                activeSlug === slug
                  ? "bg-fg text-app"
                  : "bg-surface hover:bg-surface-hover"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {canScrollLeft && (
          <div className="absolute inset-y-0 left-0 hidden items-center bg-linear-to-r from-app from-60% to-transparent pr-8 md:flex">
            <IconButton label="Scroll categories left" onClick={() => scrollBy(-1)}>
              <IoChevronBack size={20} />
            </IconButton>
          </div>
        )}
        {canScrollRight && (
          <div className="absolute inset-y-0 right-0 hidden items-center bg-linear-to-l from-app from-60% to-transparent pl-8 md:flex">
            <IconButton label="Scroll categories right" onClick={() => scrollBy(1)}>
              <IoChevronForward size={20} />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default ButtonList;
