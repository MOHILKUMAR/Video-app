import React from "react";
import { useSearchParams } from "react-router-dom";
import VideoCard, { VideoGrid } from "./VideoCard";
import { VideoCardShimmer, VideoGridShimmer } from "./Shimmer";
import ErrorMessage from "./ErrorMessage";
import EndOfFeed from "./EndOfFeed";
import InfiniteScrollTrigger from "./InfiniteScrollTrigger";
import { SAMPLE_VIDEOS, getCategory } from "../utils/constants";
import { fetchPopularVideos } from "../utils/youtubeApi";
import useVideoFeed from "../utils/useVideoFeed";

const LOADING_MORE_PLACEHOLDERS = 8;

const VideoContainer = () => {
  const [searchParams] = useSearchParams();
  const category = getCategory(searchParams.get("category"));
  const { videos, status, error, hasMore, loadMore, retry } = useVideoFeed(
    `popular:${category.slug}`,
    (pageToken) => fetchPopularVideos(category.categoryId, pageToken)
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

      {status === "ready" && !hasMore && videos.length > 0 && (
        <EndOfFeed
          title="You're all caught up"
          message="That's every trending video in this category right now."
        />
      )}
    </>
  );
};

export default VideoContainer;
