import { REGION_CODE, getThumbnailUrl } from "./constants";
import { formatDuration } from "./format";

const API_BASE = "https://www.googleapis.com/youtube/v3";
// Parcel inlines this from the .env file at build time.
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Keyed by the "reason" codes the API returns in error.details / error.errors.
const ERROR_MESSAGES = {
  API_KEY_INVALID:
    "Your YouTube API key is not valid. Check YOUTUBE_API_KEY in the .env file.",
  quotaExceeded:
    "The daily YouTube API quota is used up. It resets at midnight Pacific Time.",
  accessNotConfigured:
    "YouTube Data API v3 is not enabled for this key's Google Cloud project.",
  SERVICE_DISABLED:
    "YouTube Data API v3 is not enabled for this key's Google Cloud project.",
  API_KEY_HTTP_REFERRER_BLOCKED:
    "This API key's restrictions don't allow requests from this website.",
};

const getErrorMessage = (error) => {
  const reasons = [
    ...(error?.details ?? []).map((d) => d.reason),
    ...(error?.errors ?? []).map((e) => e.reason),
  ];
  const known = reasons.find((reason) => ERROR_MESSAGES[reason]);
  return known
    ? ERROR_MESSAGES[known]
    : error?.message ?? "The YouTube API request failed.";
};

const request = async (endpoint, params) => {
  if (!YOUTUBE_API_KEY) {
    throw new Error(
      "No YouTube API key found. Add YOUTUBE_API_KEY to the .env file and restart npm start."
    );
  }

  const query = new URLSearchParams({ ...params, key: YOUTUBE_API_KEY });
  let response;
  try {
    response = await fetch(`${API_BASE}/${endpoint}?${query}`);
  } catch {
    throw new Error("Couldn't reach YouTube. Check your internet connection.");
  }

  const json = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(json.error));
  return json;
};

// Keep each request's promise so repeat visits (and the daily quota) are
// spared. Failed requests are dropped so "Try again" makes a fresh call.
const cache = new Map();
const cached = (key, load) => {
  if (!cache.has(key)) {
    cache.set(
      key,
      load().catch((error) => {
        cache.delete(key);
        throw error;
      })
    );
  }
  return cache.get(key);
};

// videos.list costs 1 quota unit no matter how many parts are requested.
const VIDEO_PARTS = "snippet,statistics,contentDetails";

const normalizeVideo = ({ id, snippet, statistics, contentDetails }) => ({
  id,
  title: snippet.title,
  channel: snippet.channelTitle,
  channelId: snippet.channelId,
  description: snippet.description,
  thumbnail:
    snippet.thumbnails?.high?.url ??
    snippet.thumbnails?.medium?.url ??
    getThumbnailUrl(id),
  publishedAt: snippet.publishedAt,
  views: statistics?.viewCount,
  duration: formatDuration(contentDetails?.duration),
  isLive: snippet.liveBroadcastContent === "live",
});

// One channels.list call (1 unit) fetches avatars for up to 50 channels.
const withChannelAvatars = async (videos) => {
  const channelIds = [...new Set(videos.map((v) => v.channelId))].slice(0, 50);
  if (channelIds.length === 0) return videos;

  try {
    const json = await request("channels", {
      part: "snippet",
      id: channelIds.join(","),
      maxResults: "50",
    });
    const avatars = new Map(
      json.items.map((channel) => [
        channel.id,
        channel.snippet.thumbnails?.default?.url,
      ])
    );
    return videos.map((v) => ({ ...v, channelAvatar: avatars.get(v.channelId) }));
  } catch {
    // Avatars are a nice-to-have; cards fall back to a letter avatar.
    return videos;
  }
};

// One page of the trending chart. Pass the previous page's nextPageToken to
// get the following page; nextPageToken is null after the last one.
export const fetchPopularVideos = (categoryId, pageToken = null) =>
  cached(`popular:${categoryId ?? "all"}:${pageToken ?? "first"}`, async () => {
    const json = await request("videos", {
      part: VIDEO_PARTS,
      chart: "mostPopular",
      regionCode: REGION_CODE,
      maxResults: "24",
      ...(categoryId && { videoCategoryId: categoryId }),
      ...(pageToken && { pageToken }),
    });
    return {
      videos: await withChannelAvatars(json.items.map(normalizeVideo)),
      nextPageToken: json.nextPageToken ?? null,
    };
  });

export const searchVideos = (query) =>
  cached(`search:${query.toLowerCase()}`, async () => {
    // search.list costs 100 units, so only ask it for ids...
    const results = await request("search", {
      part: "id",
      type: "video",
      maxResults: "25",
      q: query,
    });
    const ids = results.items.map((item) => item.id.videoId);
    if (ids.length === 0) return [];

    // ...then get titles, views and durations from videos.list (1 unit).
    const details = await request("videos", {
      part: VIDEO_PARTS,
      id: ids.join(","),
    });
    const videos = details.items
      .map(normalizeVideo)
      .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
    return withChannelAvatars(videos);
  });

export const fetchVideoById = (id) =>
  cached(`video:${id}`, async () => {
    const json = await request("videos", { part: VIDEO_PARTS, id });
    if (json.items.length === 0) {
      throw new Error("This video is unavailable or has been removed.");
    }
    const [video] = await withChannelAvatars(json.items.map(normalizeVideo));
    return video;
  });
