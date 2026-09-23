import { useCallback, useEffect, useRef, useState } from "react";

// status: "loading"     first page on its way
//         "ready"       idle, more pages may follow
//         "loadingMore" next page on its way
//         "error"       first page failed
//         "errorMore"   a later page failed; the loaded videos stay visible
const INITIAL = { videos: [], nextPageToken: null, status: "loading", error: null };

// Loaded feeds survive leaving the page, so pressing Back from a video
// restores every page you had scrolled through (and your scroll position).
const feedCache = new Map();

// Results can shift between page requests; drop any repeats.
const mergeUnique = (current, incoming) => {
  const seen = new Set(current.map((v) => v.id));
  return [...current, ...incoming.filter((v) => !seen.has(v.id))];
};

// A paginated list of videos for infinite scroll.
//   cacheKey:  identifies the feed, e.g. "popular:music" or "search:react"
//   fetchPage: (pageToken) => Promise<{ videos, nextPageToken }>
const useVideoFeed = (cacheKey, fetchPage) => {
  const [feed, setFeed] = useState(() => feedCache.get(cacheKey) ?? INITIAL);
  const [attempt, setAttempt] = useState(0);
  const feedRef = useRef(feed);
  feedRef.current = feed;
  // fetchPage is a new function on every render; keep the latest one.
  const fetchPageRef = useRef(fetchPage);
  fetchPageRef.current = fetchPage;
  // Bumped whenever the feed changes, so late responses for an old
  // category or search are ignored.
  const generationRef = useRef(0);

  useEffect(() => {
    const generation = ++generationRef.current;
    const cachedFeed = feedCache.get(cacheKey);
    if (cachedFeed) {
      setFeed(cachedFeed);
      return;
    }

    setFeed(INITIAL);
    fetchPageRef.current(null).then(
      ({ videos, nextPageToken }) => {
        if (generation !== generationRef.current) return;
        const next = { videos, nextPageToken, status: "ready", error: null };
        feedCache.set(cacheKey, next);
        setFeed(next);
      },
      (error) => {
        if (generation !== generationRef.current) return;
        setFeed({ ...INITIAL, status: "error", error });
      }
    );
  }, [cacheKey, attempt]);

  const loadMore = useCallback(() => {
    const { status, nextPageToken } = feedRef.current;
    if (!nextPageToken || (status !== "ready" && status !== "errorMore")) return;

    const generation = generationRef.current;
    // Update the ref right away so a second trigger before the next render
    // doesn't start a duplicate request.
    feedRef.current = { ...feedRef.current, status: "loadingMore", error: null };
    setFeed(feedRef.current);

    fetchPageRef.current(nextPageToken).then(
      ({ videos, nextPageToken: following }) => {
        if (generation !== generationRef.current) return;
        const next = {
          videos: mergeUnique(feedRef.current.videos, videos),
          nextPageToken: following,
          status: "ready",
          error: null,
        };
        feedCache.set(cacheKey, next);
        setFeed(next);
      },
      (error) => {
        if (generation !== generationRef.current) return;
        setFeed((current) => ({ ...current, status: "errorMore", error }));
      }
    );
  }, [cacheKey]);

  return {
    ...feed,
    hasMore: Boolean(feed.nextPageToken),
    loadMore,
    retry: () => setAttempt((n) => n + 1),
  };
};

export default useVideoFeed;
