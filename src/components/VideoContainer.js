import React from "react";
import { useSearchParams } from "react-router-dom";
import VideoCard, { VideoGrid } from "./VideoCard";
import { VideoGridShimmer } from "./Shimmer";
import ErrorMessage from "./ErrorMessage";
import { SAMPLE_VIDEOS, getCategory } from "../utils/constants";
import { fetchPopularVideos } from "../utils/youtubeApi";
import useAsync from "../utils/useAsync";

const VideoContainer = () => {
  const [searchParams] = useSearchParams();
  const category = getCategory(searchParams.get("category"));
  const { status, data, error, retry } = useAsync(
    () => fetchPopularVideos(category.categoryId),
    [category.categoryId]
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
    <VideoGrid>
      {data.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </VideoGrid>
  );
};

export default VideoContainer;
