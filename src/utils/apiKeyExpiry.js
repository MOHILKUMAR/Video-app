// Countdown for the YouTube API key, configured in .env:
//   YOUTUBE_API_KEY_CREATED=2026-09-23   date the key was created (YYYY-MM-DD)
//   YOUTUBE_API_KEY_VALID_DAYS=30        how many days it lasts (default 30)
const CREATED = process.env.YOUTUBE_API_KEY_CREATED;
const VALID_DAYS = Number(process.env.YOUTUBE_API_KEY_VALID_DAYS) || 30;
const DAY_MS = 24 * 60 * 60 * 1000;

// "2026-09-23" -> local midnight on that day (not UTC, which can shift the date).
const parseLocalDate = (value) => {
  const match = value?.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const [year, month, day] = match.slice(1).map(Number);
  return new Date(year, month - 1, day);
};

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

// Returns null when no valid created date is set, so the badge stays hidden.
export const getApiKeyStatus = (now = new Date()) => {
  const createdAt = parseLocalDate(CREATED);
  if (!createdAt) return null;

  const expiresAt = new Date(createdAt);
  expiresAt.setDate(expiresAt.getDate() + VALID_DAYS);

  // Math.round absorbs the hour gained or lost on daylight-saving days.
  const daysUsed = Math.max(
    0,
    Math.round((startOfDay(now) - createdAt) / DAY_MS)
  );
  const daysLeft = VALID_DAYS - daysUsed;

  let level = "ok";
  if (daysLeft <= 0) level = "expired";
  else if (daysLeft <= 3) level = "danger";
  else if (daysLeft <= 7) level = "warning";

  return {
    createdAt,
    expiresAt,
    totalDays: VALID_DAYS,
    day: Math.min(daysUsed + 1, VALID_DAYS),
    daysUsed,
    daysLeft,
    level,
  };
};
