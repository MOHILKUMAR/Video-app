import React from "react";
import { Link } from "react-router-dom";
import ChannelAvatar from "./ChannelAvatar";
import { getThumbnailUrl } from "../utils/constants";
import { formatViews, timeAgo } from "../utils/format";

// Responsive to the width of <main>, so it adapts when the sidebar collapses.
export const VideoGrid = ({ children, ...props }) => (
  <div
    className="grid grid-cols-1 gap-x-4 gap-y-8 @xl:grid-cols-2 @4xl:grid-cols-3 @6xl:grid-cols-4"
    {...props}
  >
    {children}
  </div>
);

const getMeta = ({ views, publishedAt }) =>
  [formatViews(views), timeAgo(publishedAt)].filter(Boolean).join(" • ");

const VideoBadge = ({ duration, isLive }) => {
  if (isLive) {
    return (
      <span className="absolute right-1.5 bottom-1.5 rounded bg-red-600 px-1.5 py-0.5 text-xs font-medium text-white">
        LIVE
      </span>
    );
  }
  if (!duration) return null;
  return (
    <span className="absolute right-1.5 bottom-1.5 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
      {duration}
    </span>
  );
};

const Thumbnail = ({ video, className = "" }) => (
  <div className={`relative aspect-video shrink-0 overflow-hidden bg-surface ${className}`}>
    <img
      src={video.thumbnail ?? getThumbnailUrl(video.id)}
      alt=""
      loading="lazy"
      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
    <VideoBadge duration={video.duration} isLive={video.isLive} />
  </div>
);

const WatchLink = ({ video, className, children }) => (
  <Link
    to={"/watch?v=" + video.id}
    state={{ video }}
    className={`group rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600 ${className}`}
  >
    {children}
  </Link>
);

// Home page grid card.
const VideoCard = ({ video }) => {
  const meta = getMeta(video);
  return (
    <WatchLink video={video} className="block">
      <Thumbnail video={video} className="rounded-xl" />
      <div className="mt-3 flex gap-3">
        <ChannelAvatar name={video.channel} src={video.channelAvatar} />
        <div className="min-w-0">
          <h3 className="line-clamp-2 leading-snug font-medium">{video.title}</h3>
          <p className="mt-1 truncate text-sm text-muted">{video.channel}</p>
          {meta && <p className="text-sm text-muted">{meta}</p>}
        </div>
      </div>
    </WatchLink>
  );
};

// Search results: stacked on narrow screens, side by side on wider ones.
export const VideoRow = ({ video }) => {
  const meta = getMeta(video);
  return (
    <WatchLink video={video} className="flex flex-col gap-3 @2xl:flex-row @2xl:gap-4">
      <Thumbnail video={video} className="w-full rounded-xl @2xl:w-80 @4xl:w-96" />
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-base leading-snug font-medium @2xl:text-lg">
          {video.title}
        </h3>
        {meta && <p className="mt-1 text-xs text-muted">{meta}</p>}
        <div className="mt-2 flex items-center gap-2">
          <ChannelAvatar name={video.channel} src={video.channelAvatar} size="size-6" />
          <span className="truncate text-sm text-muted">{video.channel}</span>
        </div>
        {video.description && (
          // line-clamp needs its own display mode, so it lives on the inner <p>.
          <div className="mt-2 hidden @2xl:block">
            <p className="line-clamp-2 text-xs text-muted">{video.description}</p>
          </div>
        )}
      </div>
    </WatchLink>
  );
};

// Watch page "Up next" list.
export const CompactVideoCard = ({ video }) => {
  const meta = getMeta(video);
  return (
    <WatchLink video={video} className="flex gap-2">
      <Thumbnail video={video} className="w-40 rounded-lg sm:w-44" />
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-sm leading-snug font-medium">{video.title}</h3>
        <p className="mt-1 truncate text-xs text-muted">{video.channel}</p>
        {meta && <p className="text-xs text-muted">{meta}</p>}
      </div>
    </WatchLink>
  );
};

export default VideoCard;
