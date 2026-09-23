import React, { useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { FaYoutube } from "react-icons/fa";
import ChannelAvatar from "./ChannelAvatar";
import { CompactVideoCard } from "./VideoCard";
import { CompactVideoShimmer, WatchDetailsShimmer } from "./Shimmer";
import ErrorMessage from "./ErrorMessage";
import { SAMPLE_VIDEOS } from "../utils/constants";
import { formatViews, timeAgo } from "../utils/format";
import { fetchPopularVideos, fetchVideoById } from "../utils/youtubeApi";
import useAsync from "../utils/useAsync";

const Description = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p
        className={`mt-1 break-words whitespace-pre-line ${
          expanded ? "" : "line-clamp-3"
        }`}
      >
        {text}
      </p>
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="mt-1 font-medium hover:underline"
      >
        {expanded ? "Show less" : "Show more"}
      </button>
    </>
  );
};

const VideoDetails = ({ video }) => {
  const meta = [formatViews(video.views), timeAgo(video.publishedAt)]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="mt-3">
      <h1 className="text-lg leading-snug font-bold sm:text-xl">{video.title}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <ChannelAvatar name={video.channel} src={video.channelAvatar} size="size-10" />
        <p className="min-w-0 flex-1 truncate font-medium">{video.channel}</p>
        <a
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-hover"
        >
          <FaYoutube size={18} className="text-red-600" /> Open on YouTube
        </a>
      </div>
      {(meta || video.description) && (
        <div className="mt-4 rounded-xl bg-surface p-3 text-sm">
          {meta && <p className="font-medium">{meta}</p>}
          {video.description && <Description key={video.id} text={video.description} />}
        </div>
      )}
    </div>
  );
};

const WatchPage = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("v");
  const location = useLocation();
  // Cards pass their video along, so details show instantly without a request.
  const passedVideo =
    location.state?.video?.id === videoId ? location.state.video : null;

  const details = useAsync(
    () => (passedVideo ? Promise.resolve(passedVideo) : fetchVideoById(videoId)),
    [videoId]
  );
  const upNext = useAsync(() => fetchPopularVideos(null), []);

  if (!videoId) {
    return (
      <div className="pt-6">
        <ErrorMessage title="No video selected" message="Pick a video from the home page." />
        <Link to="/" className="mt-4 inline-block font-medium text-blue-600 hover:underline dark:text-blue-400">
          Go to home
        </Link>
      </div>
    );
  }

  const sampleVideo = SAMPLE_VIDEOS.find((v) => v.id === videoId);
  const video = details.data ?? (details.status === "error" ? sampleVideo : null);
  const upNextVideos = (
    upNext.data ?? (upNext.status === "error" ? SAMPLE_VIDEOS : [])
  )
    .filter((v) => v.id !== videoId)
    .slice(0, 16);

  return (
    <div className="mx-auto flex max-w-[1760px] flex-col gap-6 pt-4 lg:flex-row lg:pt-6">
      <div className="min-w-0 flex-1">
        <div className="aspect-video overflow-hidden rounded-xl bg-black">
          <iframe
            key={videoId}
            className="size-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={video?.title ?? "YouTube video player"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
        {details.status === "loading" && <WatchDetailsShimmer />}
        {video && <VideoDetails video={video} />}
        {details.status === "error" && !video && (
          <div className="mt-4">
            <ErrorMessage
              title="Couldn't load video details"
              message={details.error.message}
              onRetry={details.retry}
            />
          </div>
        )}
      </div>

      <aside className="w-full shrink-0 lg:w-96">
        <h2 className="mb-3 font-medium">Up next</h2>
        {upNext.status === "loading" ? (
          <CompactVideoShimmer />
        ) : (
          <div className="flex flex-col gap-3">
            {upNextVideos.map((v) => (
              <CompactVideoCard key={v.id} video={v} />
            ))}
          </div>
        )}
      </aside>
    </div>
  );
};

export default WatchPage;
