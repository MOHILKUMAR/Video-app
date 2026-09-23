import React from "react";
import { useSearchParams } from "react-router-dom";
import { MdSearchOff } from "react-icons/md";
import { VideoRow } from "./VideoCard";
import { VideoRowShimmer } from "./Shimmer";
import ErrorMessage from "./ErrorMessage";
import EndOfFeed from "./EndOfFeed";
import InfiniteScrollTrigger from "./InfiniteScrollTrigger";
import { searchVideos } from "../utils/youtubeApi";
import useVideoFeed from "../utils/useVideoFeed";

const NO_RESULTS = Promise.resolve({ videos: [], nextPageToken: null });

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("search_query") ?? "").trim();
  const { videos, status, error, hasMore, loadMore, retry } = useVideoFeed(
    `search:${query.toLowerCase()}`,
    (pageToken) => (query ? searchVideos(query, pageToken) : NO_RESULTS)
  );

  return (
    <div className="mx-auto max-w-5xl pt-4 sm:pt-6">
      {status === "loading" && <VideoRowShimmer />}

      {status === "error" && (
        <ErrorMessage title="Search failed" message={error.message} onRetry={retry} />
      )}

      {status === "ready" && videos.length === 0 && (
        <div className="flex flex-col items-center py-20 text-center">
          <MdSearchOff size={56} className="text-muted" />
          <p className="mt-4 text-lg font-medium">
            {query ? `No results for "${query}"` : "Search for a video"}
          </p>
          <p className="mt-1 text-sm text-muted">
            {query
              ? "Try different keywords or check the spelling."
              : "Type something in the search bar above."}
          </p>
        </div>
      )}

      {videos.length > 0 && (
        <>
          <div className="flex flex-col gap-6 @2xl:gap-4">
            {videos.map((video) => (
              <VideoRow key={video.id} video={video} />
            ))}
            {status === "loadingMore" && <VideoRowShimmer count={3} />}
          </div>

          {/* Search pages cost 100 quota units each (trending pages cost 1),
              so start loading closer to the bottom than the home feed does. */}
          {status === "ready" && hasMore && (
            <InfiniteScrollTrigger onVisible={loadMore} rootMargin="400px" />
          )}

          {status === "errorMore" && (
            <div className="mt-8">
              <ErrorMessage
                title="Couldn't load more results"
                message={error.message}
                onRetry={loadMore}
              />
            </div>
          )}

          {status === "ready" && !hasMore && (
            <EndOfFeed
              title="No more results"
              message={`That's everything YouTube returned for "${query}".`}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
