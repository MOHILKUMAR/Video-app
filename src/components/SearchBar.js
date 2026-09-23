import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IoClose, IoSearchOutline } from "react-icons/io5";
import { fetchSuggestions } from "../utils/searchSuggestions";

const DEBOUNCE_MS = 200;

const SearchBar = ({ autoFocus = false, onSearch }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("search_query") ?? "";
  const inputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Keep the box in sync with the URL (back/forward, shared links).
  useEffect(() => {
    setSearchQuery(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) {
      setSuggestions([]);
      return;
    }

    // Ignore responses for queries the user has already typed past.
    let ignore = false;
    const timer = setTimeout(() => {
      fetchSuggestions(query)
        .then((results) => {
          if (ignore) return;
          setSuggestions(results);
          setActiveIndex(-1);
        })
        .catch(() => {
          if (!ignore) setSuggestions([]);
        });
    }, DEBOUNCE_MS);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const runSearch = (query) => {
    setShowSuggestions(false);
    setActiveIndex(-1);
    if (!query.trim()) return;
    inputRef.current?.blur();
    navigate("/results?search_query=" + encodeURIComponent(query.trim()));
    onSearch?.();
  };

  const selectSuggestion = (suggestion) => {
    setSearchQuery(suggestion);
    runSearch(suggestion);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch(searchQuery);
  };

  const isOpen = showSuggestions && suggestions.length > 0;

  return (
    <form role="search" className="flex w-full max-w-2xl" onSubmit={handleSubmit}>
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          autoComplete="off"
          role="combobox"
          aria-label="Search"
          aria-expanded={isOpen}
          aria-controls="search-suggestions"
          aria-activedescendant={
            activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined
          }
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setShowSuggestions(false)}
          onKeyDown={handleKeyDown}
          className="h-10 w-full rounded-l-full border border-line bg-app pr-10 pl-4 text-base outline-none placeholder:text-muted focus:border-blue-500"
        />
        {searchQuery && (
          <button
            type="button"
            aria-label="Clear search"
            // Keep focus in the input so the list doesn't flicker.
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setSearchQuery("");
              inputRef.current?.focus();
            }}
            className="absolute top-1/2 right-1 flex size-8 -translate-y-1/2 items-center justify-center rounded-full hover:bg-surface"
          >
            <IoClose size={20} />
          </button>
        )}
        {isOpen && (
          <ul
            id="search-suggestions"
            role="listbox"
            className="absolute inset-x-0 top-full z-40 mt-1 overflow-hidden rounded-xl border border-line bg-app py-2 shadow-xl"
          >
            {suggestions.map((suggestion, i) => (
              <li
                key={suggestion}
                id={`suggestion-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                // mousedown fires before the input's blur hides the list
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectSuggestion(suggestion);
                }}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex cursor-pointer items-center gap-3 px-4 py-1.5 text-sm ${
                  i === activeIndex ? "bg-surface" : ""
                }`}
              >
                <IoSearchOutline size={16} className="shrink-0 text-muted" />
                <span className="truncate font-medium">{suggestion}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        type="submit"
        aria-label="Search"
        title="Search"
        className="flex h-10 w-14 shrink-0 items-center justify-center rounded-r-full border border-l-0 border-line bg-surface transition-colors hover:bg-surface-hover sm:w-16"
      >
        <IoSearchOutline size={20} />
      </button>
    </form>
  );
};

export default SearchBar;
