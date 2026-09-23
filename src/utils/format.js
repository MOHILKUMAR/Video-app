const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

// "1234567" -> "1.2M views"
export const formatViews = (count) =>
  count == null ? null : `${compactNumber.format(Number(count))} views`;

const relativeTime = new Intl.RelativeTimeFormat("en", { numeric: "always" });
const TIME_UNITS = [
  ["year", 365 * 24 * 60 * 60],
  ["month", 30 * 24 * 60 * 60],
  ["week", 7 * 24 * 60 * 60],
  ["day", 24 * 60 * 60],
  ["hour", 60 * 60],
  ["minute", 60],
];

// "2024-03-15T10:00:00Z" -> "6 months ago"
export const timeAgo = (isoDate) => {
  if (!isoDate) return null;
  const seconds = (Date.now() - new Date(isoDate).getTime()) / 1000;
  for (const [unit, size] of TIME_UNITS) {
    if (seconds >= size) {
      return relativeTime.format(-Math.floor(seconds / size), unit);
    }
  }
  return "just now";
};

// ISO 8601 durations from the API: "PT1H4M13S" -> "1:04:13", "PT45S" -> "0:45"
export const formatDuration = (isoDuration) => {
  const match = isoDuration?.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return null;

  const [hours, minutes, seconds] = match.slice(1).map((n) => Number(n ?? 0));
  if (hours + minutes + seconds === 0) return null;

  const ss = String(seconds).padStart(2, "0");
  return hours
    ? `${hours}:${String(minutes).padStart(2, "0")}:${ss}`
    : `${minutes}:${ss}`;
};
