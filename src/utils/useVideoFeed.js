import { useCallback, useEffect, useRef, useState } from "react";
import { fetchPopularVideos } from "./youtubeApi";

// status: "loading"     first page on its way
//         "ready"       idle, more pages may follow
//         "loadingMore" next page on its way
//         "error"       first page failed
//         "errorMore"   a later page failed; the loaded videos stay visible
const INITIAL = { videos: [], nextPageToken: null, status: "loading", error: null };

// Loaded feeds survive leaving the page, so pressing Back from a video
// restores every page you had scrolled through (and your scroll position).
const feedCache = new Map();

// Trending can shift between page requests; drop any repeats.
const mergeUnique = (current, incoming) => {
  const seen = new Set(current.map((v) => v.id));
  return [...current, ...incoming.filter((v) => !seen.has(v.id))];
};

const useVideoFeed = (categoryId) => {
  const cacheKey = categoryId ?? "all";
  const [feed, setFeed] = useState(() => feedCache.get(cacheKey) ?? INITIAL);
  const [attempt, setAttempt] = useState(0);
  const feedRef = useRef(feed);
  feedRef.current = feed;
  // Bumped on every category change, so late responses for an old
  // category are ignored.
  const generationRef = useRef(0);

  useEffect(() => {
    const generation = ++generationRef.current;
    const cachedFeed = feedCache.get(cacheKey);
    if (cachedFeed) {
      setFeed(cachedFeed);
      return;
    }

    setFeed(INITIAL);
    fetchPopularVideos(categoryId).then(
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
  }, [cacheKey, categoryId, attempt]);

  const loadMore = useCallback(() => {
    const { status, nextPageToken } = feedRef.current;
    if (!nextPageToken || (status !== "ready" && status !== "errorMore")) return;

    const generation = generationRef.current;
    // Update the ref right away so a second trigger before the next render
    // doesn't start a duplicate request.
    feedRef.current = { ...feedRef.current, status: "loadingMore", error: null };
    setFeed(feedRef.current);

    fetchPopularVideos(categoryId, nextPageToken).then(
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
  }, [cacheKey, categoryId]);

  return {
    ...feed,
    hasMore: Boolean(feed.nextPageToken),
    loadMore,
    retry: () => setAttempt((n) => n + 1),
  };
};

export default useVideoFeed;
