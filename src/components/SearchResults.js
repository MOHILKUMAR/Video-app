import React from "react";
import { useSearchParams } from "react-router-dom";
import { MdSearchOff } from "react-icons/md";
import { VideoRow } from "./VideoCard";
import { VideoRowShimmer } from "./Shimmer";
import ErrorMessage from "./ErrorMessage";
import { searchVideos } from "../utils/youtubeApi";
import useAsync from "../utils/useAsync";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("search_query") ?? "").trim();
  const { status, data, error, retry } = useAsync(
    () => (query ? searchVideos(query) : Promise.resolve([])),
    [query]
  );

  return (
    <div className="mx-auto max-w-5xl pt-4 sm:pt-6">
      {status === "loading" && <VideoRowShimmer />}

      {status === "error" && (
        <ErrorMessage title="Search failed" message={error.message} onRetry={retry} />
      )}

      {status === "success" && data.length === 0 && (
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

      {status === "success" && data.length > 0 && (
        <div className="flex flex-col gap-6 @2xl:gap-4">
          {data.map((video) => (
            <VideoRow key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
