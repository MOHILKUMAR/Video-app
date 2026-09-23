import React from "react";
import { useSearchParams } from "react-router-dom";
import { MdOutlineCheckCircle } from "react-icons/md";
import VideoCard, { VideoGrid } from "./VideoCard";
import { VideoCardShimmer, VideoGridShimmer } from "./Shimmer";
import ErrorMessage from "./ErrorMessage";
import InfiniteScrollTrigger from "./InfiniteScrollTrigger";
import { SAMPLE_VIDEOS, getCategory } from "../utils/constants";
import useVideoFeed from "../utils/useVideoFeed";

const LOADING_MORE_PLACEHOLDERS = 8;

const EndOfFeed = () => (
  <div className="mt-12 flex flex-col items-center gap-2 text-center">
    <MdOutlineCheckCircle size={40} className="text-muted" />
    <p className="font-medium">You're all caught up</p>
    <p className="text-sm text-muted">
      That's every trending video in this category right now.
    </p>
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="mt-2 rounded-full bg-surface px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-hover"
    >
      Back to top
    </button>
  </div>
);

const VideoContainer = () => {
  const [searchParams] = useSearchParams();
  const category = getCategory(searchParams.get("category"));
  const { videos, status, error, hasMore, loadMore, retry } = useVideoFeed(
    category.categoryId
  );

  if (status === "loading") return <VideoGridShimmer />;

  if (status === "error") {
    return (
      <>
        <ErrorMessage
          title="Couldn't load trending videos"
          message={error.message}
          onRetry={retry}
        />
        <h2 className="mt-8 mb-4 text-lg font-medium">Sample videos</h2>
        <VideoGrid>
          {SAMPLE_VIDEOS.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </VideoGrid>
      </>
    );
  }

  return (
    <>
      <VideoGrid>
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
        {status === "loadingMore" &&
          Array.from({ length: LOADING_MORE_PLACEHOLDERS }, (_, i) => (
            <VideoCardShimmer key={`placeholder-${i}`} />
          ))}
      </VideoGrid>

      {status === "loadingMore" && (
        <p role="status" className="sr-only">
          Loading more videos
        </p>
      )}

      {/* Only while idle: after a failed page the user retries by hand
          instead of the marker firing the same failing request again. */}
      {status === "ready" && hasMore && <InfiniteScrollTrigger onVisible={loadMore} />}

      {status === "errorMore" && (
        <div className="mt-8">
          <ErrorMessage
            title="Couldn't load more videos"
            message={error.message}
            onRetry={loadMore}
          />
        </div>
      )}

      {status === "ready" && !hasMore && videos.length > 0 && <EndOfFeed />}
    </>
  );
};

export default VideoContainer;
