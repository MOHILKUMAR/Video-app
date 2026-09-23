import React from "react";
import { VideoGrid } from "./VideoCard";

// Placeholders shaped like the real cards, shown while the API loads.
const repeat = (count, render) =>
  Array.from({ length: count }, (_, i) => render(i));

export const VideoCardShimmer = () => (
  <div>
    <div className="shimmer aspect-video rounded-xl" />
    <div className="mt-3 flex gap-3">
      <div className="shimmer size-9 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="shimmer h-4 w-11/12 rounded" />
        <div className="shimmer h-4 w-2/3 rounded" />
        <div className="shimmer h-3 w-1/2 rounded" />
      </div>
    </div>
  </div>
);

export const VideoGridShimmer = ({ count = 12 }) => (
  <VideoGrid role="status" aria-label="Loading videos">
    {repeat(count, (i) => (
      <VideoCardShimmer key={i} />
    ))}
  </VideoGrid>
);

export const VideoRowShimmer = ({ count = 6 }) => (
  <div role="status" aria-label="Loading results" className="flex flex-col gap-6 @2xl:gap-4">
    {repeat(count, (i) => (
      <div key={i} className="flex flex-col gap-3 @2xl:flex-row @2xl:gap-4">
        <div className="shimmer aspect-video w-full shrink-0 rounded-xl @2xl:w-80 @4xl:w-96" />
        <div className="flex-1 space-y-3 pt-1">
          <div className="shimmer h-5 w-11/12 rounded" />
          <div className="shimmer h-3 w-1/3 rounded" />
          <div className="flex items-center gap-2">
            <div className="shimmer size-6 rounded-full" />
            <div className="shimmer h-3 w-1/4 rounded" />
          </div>
          <div className="shimmer hidden h-3 w-3/4 rounded @2xl:block" />
        </div>
      </div>
    ))}
  </div>
);

export const CompactVideoShimmer = ({ count = 8 }) => (
  <div role="status" aria-label="Loading videos" className="flex flex-col gap-3">
    {repeat(count, (i) => (
      <div key={i} className="flex gap-2">
        <div className="shimmer aspect-video w-40 shrink-0 rounded-lg sm:w-44" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="shimmer h-3.5 w-full rounded" />
          <div className="shimmer h-3.5 w-4/5 rounded" />
          <div className="shimmer h-3 w-1/2 rounded" />
        </div>
      </div>
    ))}
  </div>
);

export const WatchDetailsShimmer = () => (
  <div role="status" aria-label="Loading video details" className="mt-3">
    <div className="shimmer h-6 w-3/4 rounded" />
    <div className="mt-4 flex items-center gap-3">
      <div className="shimmer size-10 rounded-full" />
      <div className="shimmer h-4 w-40 rounded" />
    </div>
    <div className="shimmer mt-4 h-24 rounded-xl" />
  </div>
);
