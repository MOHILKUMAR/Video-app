import React, { useEffect, useRef, useState } from "react";
import { MdOpenInNew, MdOutlineKey } from "react-icons/md";
import { getApiKeyStatus } from "../utils/apiKeyExpiry";

const STYLES = {
  ok: {
    pill: "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 dark:text-emerald-400",
    bar: "bg-emerald-500",
  },
  warning: {
    pill: "bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 dark:text-amber-400",
    bar: "bg-amber-500",
  },
  danger: {
    pill: "bg-red-500/15 text-red-700 hover:bg-red-500/25 dark:text-red-400",
    bar: "bg-red-500",
  },
  expired: {
    pill: "bg-red-600 text-white hover:bg-red-700",
    bar: "bg-red-600",
  },
};

const formatDate = (date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const getDaysLeftLabel = ({ daysLeft, level }) => {
  if (level === "expired") return "Expired";
  return `${daysLeft} ${daysLeft === 1 ? "day" : "days"} left`;
};

// Header badge reminding when the YouTube API key runs out.
const ApiKeyCounter = () => {
  const status = getApiKeyStatus();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e) => {
      if (!containerRef.current?.contains(e.target)) setIsOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  if (!status) return null;

  const { level, day, totalDays, daysUsed, createdAt, expiresAt } = status;
  const styles = STYLES[level];
  const label = getDaysLeftLabel(status);
  const percentUsed = Math.min(100, (daysUsed / totalDays) * 100);
  const isUrgent = level === "danger" || level === "expired";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={`YouTube API key: ${label}. Show details`}
        title={`YouTube API key: ${label}`}
        className={`flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium whitespace-nowrap transition-colors sm:px-3 ${styles.pill}`}
      >
        {isUrgent ? (
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-current" />
          </span>
        ) : (
          <MdOutlineKey size={16} />
        )}
        {/* Phones get a short "29d"; wider screens get "29 days left". */}
        <span className="sm:hidden">
          {level === "expired" ? "Expired" : `${status.daysLeft}d`}
        </span>
        <span className="hidden sm:inline">{label}</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="YouTube API key reminder"
          className="fixed inset-x-4 top-16 z-40 rounded-xl border border-line bg-app p-4 shadow-xl sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2 sm:w-80"
        >
          <p className="text-xs font-medium tracking-wide text-muted uppercase">
            YouTube API key
          </p>
          <p className="mt-1 text-2xl font-bold">{label}</p>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface">
            <div
              className={`h-full rounded-full ${styles.bar}`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-muted">
            {level === "expired"
              ? `All ${totalDays} days used`
              : `Day ${day} of ${totalDays}`}
          </p>

          <dl className="mt-4 grid grid-cols-2 gap-y-1 text-sm">
            <dt className="text-muted">Added on</dt>
            <dd className="text-right font-medium">{formatDate(createdAt)}</dd>
            <dt className="text-muted">
              {level === "expired" ? "Stopped on" : "Stops on"}
            </dt>
            <dd className="text-right font-medium">{formatDate(expiresAt)}</dd>
          </dl>

          <div className="mt-4 rounded-lg bg-surface p-3 text-xs text-muted">
            <p className="font-medium text-fg">When it runs out</p>
            <ol className="mt-1 list-decimal space-y-0.5 pl-4">
              <li>Create a new key in Google Cloud Console.</li>
              <li>
                In <code className="font-mono">.env</code>, replace
                YOUTUBE_API_KEY and set YOUTUBE_API_KEY_CREATED to that day's
                date.
              </li>
              <li>Restart npm start.</li>
            </ol>
          </div>

          <a
            href="https://console.cloud.google.com/apis/credentials"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Open Google Cloud credentials <MdOpenInNew size={14} />
          </a>
        </div>
      )}
    </div>
  );
};

export default ApiKeyCounter;
