import React, { useEffect, useRef } from "react";

// Invisible marker placed after the list. When it comes within `rootMargin`
// of the screen, `onVisible` runs, so the next page starts loading before
// the user actually hits the bottom.
const InfiniteScrollTrigger = ({ onVisible, rootMargin = "800px" }) => {
  const markerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onVisible();
      },
      { rootMargin }
    );
    observer.observe(markerRef.current);
    return () => observer.disconnect();
  }, [onVisible, rootMargin]);

  return <div ref={markerRef} aria-hidden="true" className="h-px" />;
};

export default InfiniteScrollTrigger;
