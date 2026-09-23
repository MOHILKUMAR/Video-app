# 🎬 VideoApp: A YouTube Clone

A modern, responsive YouTube clone built with **React 19**, **Redux Toolkit**, **React Router 7** and **Tailwind CSS 4**, powered by the **YouTube Data API v3**.

Browse trending videos by category, search with live autocomplete suggestions, scroll endlessly through both, and watch videos in an embedded player, in light or dark mode, on any screen size.

---

## 🚀 Features

- 🔥 **Trending videos**: live "most popular" videos for India, with views, upload time, duration and channel pictures
- ♾️ **Infinite scroll**: on the home page (24 videos per page) and in search results (50 per page), more load automatically as you near the bottom, until YouTube has no more
- 🗂️ **Categories**: Music, Gaming, Sports, News and more, from the chip bar or the sidebar
- 🔍 **Search with autocomplete**: debounced live suggestions, full keyboard support (↑ ↓ Enter Esc)
- 📺 **Watch page**: embedded player, video details with "Show more", and an "Up next" list
- ✨ **Shimmer loading**: skeleton placeholders shaped like the real content while data loads
- 🌙 **Dark mode**: follows your system setting, remembers your choice, and never flashes the wrong theme
- 📱 **Responsive layout**: full sidebar on desktop, icon rail on tablets, slide-in drawer and full-width search on phones
- ⏳ **API key reminder** (development only): a header badge counts down the days left on your API key and turns amber, then red, as the end gets close
- ⚠️ **Friendly errors**: clear messages for a missing or invalid key and quota limits, a "Try again" button, and a 404 page

---

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Parcel](https://img.shields.io/badge/Parcel-2-E7A14F?logo=parcel&logoColor=white)
![YouTube Data API](https://img.shields.io/badge/YouTube_Data_API-v3-FF0000?logo=youtube&logoColor=white)

### Frontend

| Technology | Version | What it does in this project |
|---|---|---|
| [React](https://react.dev/) | 19.1 | Builds the UI from components (`Head`, `VideoCard`, `WatchPage`...) and manages local state with hooks (`useState`, `useEffect`, `useRef`, `useSyncExternalStore`) |
| [React DOM](https://react.dev/reference/react-dom) | 19.1 | Renders the app into `<div id="root">` with `createRoot` |
| JavaScript (ES2022+) | n/a | Async/await, optional chaining (`?.`), nullish coalescing (`??`), modules, `Map` and `Set` |

### State management

| Technology | Version | What it does in this project |
|---|---|---|
| [Redux Toolkit](https://redux-toolkit.js.org/) | 2.8 | `configureStore` and `createSlice` for the app slice: sidebar expanded, drawer open, current theme |
| [React Redux](https://react-redux.js.org/) | 9.2 | `<Provider>`, `useSelector` and `useDispatch` connect components to the store |
| [Redux](https://redux.js.org/) | 5.0 | The core store that Redux Toolkit is built on |

### Routing

| Technology | Version | What it does in this project |
|---|---|---|
| [React Router](https://reactrouter.com/) (`react-router-dom`) | 7.18 | `createBrowserRouter` with nested routes and `<Outlet />`, `useSearchParams` for `?search_query=`, `?category=` and `?v=`, `useNavigate`, `<Link state>`, `<ScrollRestoration />` and a `*` 404 route |

### Styling and UI

| Technology | Version | What it does in this project |
|---|---|---|
| [Tailwind CSS](https://tailwindcss.com/) | 4.1 | Utility classes for every component, custom `dark` variant, `@theme` color tokens, container queries (`@container`, `@xl:`), custom `shimmer` and `no-scrollbar` utilities |
| [@tailwindcss/postcss](https://tailwindcss.com/docs/installation/using-postcss) | 4.1 | PostCSS plugin that compiles Tailwind, set up in `.postcssrc` |
| CSS custom properties | n/a | Light and dark theme colors (`--app-bg`, `--app-surface`...) switched by a `.dark` class |
| [react-icons](https://react-icons.github.io/react-icons/) | 5.5 | Icons from Material Design (`md`), Ionicons (`io5`), Font Awesome (`fa`) and Radix (`rx`) |
| [Roboto](https://fonts.google.com/specimen/Roboto) (Google Fonts) | n/a | App font, the same family YouTube uses |

### Build tooling

| Technology | Version | What it does in this project |
|---|---|---|
| [Parcel](https://parceljs.org/) | 2.16 | Zero-config dev server with hot reload (`npm start`) and production bundler (`npm run build`); transpiles JSX, runs PostCSS, and inlines `process.env` values from `.env` |
| [Node.js](https://nodejs.org/) + npm | 18+ | Runs Parcel and installs dependencies (tested on Node 22 and 24) |
| [Vercel](https://vercel.com/) | n/a | Hosting: builds on every push to `main`, with `vercel.json` rewrites for client-side routes |

### APIs and data

| Service | What it does in this project |
|---|---|
| [YouTube Data API v3](https://developers.google.com/youtube/v3) | `videos.list` (trending, video details), `search.list` (search), `channels.list` (channel pictures) |
| Google Suggest (`suggestqueries.google.com`) | Search autocomplete suggestions, loaded with JSONP because it doesn't allow CORS |
| [YouTube embed player](https://developers.google.com/youtube/iframe_api_reference) | Plays videos on the watch page through an `<iframe>` |
| `i.ytimg.com` / `yt3.ggpht.com` | Video thumbnails and channel pictures |

### Browser APIs used

| API | Where it's used |
|---|---|
| `fetch` | YouTube Data API requests |
| `localStorage` | Remembering the light or dark theme |
| `window.matchMedia` | Following the system theme, and detecting desktop vs mobile in `useMediaQuery` |
| `IntersectionObserver` | Infinite scroll: loading the next page when the end of the grid comes near |
| `ResizeObserver` | Showing or hiding the category chip scroll arrows when their row changes width |
| `Intl.NumberFormat` / `Intl.RelativeTimeFormat` | "1.2M views" and "3 days ago" |
| `setTimeout` / `clearTimeout` | Debouncing search suggestions |
| Dynamic `<script>` tags | JSONP requests for autocomplete |

---

## ⚡ Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- A YouTube Data API v3 key (free)

### 2. Get a YouTube API key

1. Open the [Google Cloud Console](https://console.cloud.google.com/) and create a project.
2. Go to **APIs & Services → Library**, search for **YouTube Data API v3** and click **Enable**.
3. Go to **APIs & Services → Credentials → Create credentials → API key**.
4. (Recommended) Restrict the key: under **Application restrictions** choose *Websites* and add `http://localhost:1234/*` plus your deployed site; under **API restrictions** allow only *YouTube Data API v3*.

### 3. Install and run

```bash
git clone https://github.com/MOHILKUMAR/Video-app.git
cd Video-app
npm install
```

Create a file named `.env` in the project root:

```env
YOUTUBE_API_KEY=your_api_key_here

# Optional: shows the API key countdown badge in the header.
# The day you created the key (YYYY-MM-DD) and how many days it lasts.
YOUTUBE_API_KEY_CREATED=2026-09-23
YOUTUBE_API_KEY_VALID_DAYS=30
```

Start the dev server and open http://localhost:1234:

```bash
npm start
```

Build for production (output goes to `dist/`):

```bash
npm run build
```

> `.env` is listed in `.gitignore`, so your key is never committed. Parcel reads `.env` only at startup, so **restart `npm start` after changing it**.

### 4. API key reminder

When `YOUTUBE_API_KEY_CREATED` is set, the header shows how many days your key has left. The badge appears only in development (`npm start`); production builds (`npm run build`) leave it out, so visitors to your deployed site never see it.

| Days left | Badge |
|---|---|
| More than 7 | 🟢 Green: "29 days left" |
| 4 to 7 | 🟡 Amber |
| 1 to 3 | 🔴 Red with a pulsing dot |
| 0 | 🔴 Solid red: "Expired" |

Click the badge to see the day count (for example "Day 2 of 30"), the date the key stops, and the steps to renew it. When you create a new key, update `YOUTUBE_API_KEY` and `YOUTUBE_API_KEY_CREATED` in `.env` and restart `npm start`. Leave `YOUTUBE_API_KEY_CREATED` out to hide the badge.

> By default, Google API keys don't expire, and the YouTube Data API is free with a daily quota. The countdown is a reminder for keys that do have a time limit; set `YOUTUBE_API_KEY_VALID_DAYS` to match yours.

---

## ▲ Deploy to Vercel

The repo includes a [`vercel.json`](vercel.json), so Vercel needs almost no setup:

```json
{
  "buildCommand": "rm -rf dist && { PARCEL_WORKERS=0 npm run build || test -f dist/index.html; }",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- **`buildCommand`** works around a crash on Vercel's Linux build machines: Parcel finishes the build (`✨ Built in ...`) and then crashes with `SIGSEGV` while shutting down, which Vercel reports as a failed deploy.
  - `PARCEL_WORKERS=0` runs Parcel without helper threads, avoiding the crash while they shut down.
  - `|| test -f dist/index.html` is a safety net: if Parcel still crashes *after* writing the site, the build counts as successful.
  - `rm -rf dist` runs first, so a real build error (which writes no `index.html`) still fails the deploy.
- **`outputDirectory: "dist"`** is where Parcel writes the production build.
- **`rewrites`** sends every page URL (`/watch?v=...`, `/results?...`) to `index.html` so React Router can handle it. Without it, refreshing or opening a shared link returns a Vercel **404**. Real files like the JS and CSS bundles are still served normally.

### Steps

1. On [vercel.com](https://vercel.com/new), click **Add New → Project** and import this GitHub repo. Vercel detects the settings from `vercel.json`.
2. Before deploying, open **Environment Variables** and add:

   | Name | Value | Environments |
   |---|---|---|
   | `YOUTUBE_API_KEY` | your API key | Production, Preview |

3. Click **Deploy**. Every push to `main` redeploys automatically.
4. In the Google Cloud Console, add your Vercel address (for example `https://your-app.vercel.app/*`) to the key's **website restrictions**, next to `http://localhost:1234/*`.

> **The key is read at build time.** Parcel copies `process.env.YOUTUBE_API_KEY` into the JavaScript bundle while building, so after adding or changing the variable in Vercel you must **redeploy** (Deployments → ⋯ → Redeploy) for it to take effect. `.env` is never uploaded to GitHub, so Vercel only knows the key through this setting.

The API key reminder badge is development-only, so `YOUTUBE_API_KEY_CREATED` and `YOUTUBE_API_KEY_VALID_DAYS` aren't needed on Vercel.

---

## 📁 Project Structure

```
Video-app/
├── index.html                 # Entry HTML, Roboto font, no-flash theme script
├── style.css                  # Tailwind 4, theme colors, shimmer + utilities
├── .env                       # API key + key reminder dates (not committed)
├── vercel.json                # Vercel build output + client-side route rewrites
├── package.json
└── src/
    ├── App.js                 # Redux store, routes, theme effect
    ├── components/
    │   ├── Head.js            # Header: menu, logo, search, theme toggle
    │   ├── ApiKeyCounter.js   # Header badge: days left on the API key
    │   ├── SearchBar.js       # Debounced autocomplete search
    │   ├── Sidebar.js         # Docked sidebar, icon rail, mobile drawer
    │   ├── Body.js            # Layout: sidebar + page + footer
    │   ├── Footer.js
    │   ├── MainContainer.js   # Home page: chips + video grid
    │   ├── ButtonList.js      # Scrollable category chips
    │   ├── VideoContainer.js  # Trending videos grid with infinite scroll
    │   ├── InfiniteScrollTrigger.js # Loads more when it nears the screen
    │   ├── EndOfFeed.js       # "You're all caught up" / "No more results"
    │   ├── VideoCard.js       # Grid card, search row, compact card
    │   ├── SearchResults.js   # /results page with infinite scroll
    │   ├── WatchPage.js       # /watch page: player, details, up next
    │   ├── Shimmer.js         # Loading skeletons
    │   ├── ChannelAvatar.js   # Channel picture or letter fallback
    │   ├── ErrorMessage.js    # Error card with "Try again"
    │   ├── IconButton.js
    │   ├── Logo.js
    │   └── NotFound.js        # 404 page
    └── utils/
        ├── appStore.js        # Redux store
        ├── appSlice.js        # Menu, drawer and theme state
        ├── youtubeApi.js      # API calls, caching, error messages
        ├── apiKeyExpiry.js    # Days used / left for the API key
        ├── searchSuggestions.js # JSONP autocomplete
        ├── useAsync.js        # loading / success / error hook
        ├── useVideoFeed.js    # Paginated feed for infinite scroll (home + search)
        ├── useMediaQuery.js   # Screen size hook
        ├── format.js          # "1.2M views", "3 days ago", "4:13"
        └── constants.js       # Categories, region, sample videos
```

### Routes

| URL | Page |
|---|---|
| `/` | Trending videos |
| `/?category=music` | Trending videos in a category |
| `/results?search_query=react` | Search results |
| `/watch?v=VIDEO_ID` | Watch page |
| anything else | 404 page |

---

## 🧠 Concepts You'll Learn

This project is small, but it covers many techniques used in real production apps. Each concept below points to the file where it lives.

### 1. Debouncing (search suggestions)

**Problem:** typing "react" fires 5 key events. Calling the suggestion API on every keystroke wastes requests and makes the dropdown flicker.

**Solution:** wait until the user **pauses typing for 200 ms**, then make one request. Each new keystroke cancels the previous timer.

```
keys typed:   r    re    rea    reac    react
timer:        ✗    ✗     ✗      ✗       ✓  (fires 200 ms after the last key)
API calls:                               1 request for "react"
```

In React this is a `setTimeout` inside `useEffect`, and the effect's **cleanup function** clears the timer whenever `searchQuery` changes again ([SearchBar.js](src/components/SearchBar.js)):

```js
useEffect(() => {
  const query = searchQuery.trim();
  if (!query) {
    setSuggestions([]);
    return;
  }

  let ignore = false;
  const timer = setTimeout(() => {
    fetchSuggestions(query).then((results) => {
      if (!ignore) setSuggestions(results);
    });
  }, DEBOUNCE_MS); // 200

  return () => {
    ignore = true;       // see concept 2
    clearTimeout(timer); // a new keystroke cancels the pending request
  };
}, [searchQuery]);
```

> **Debounce vs throttle:** debounce runs *once after activity stops* (search boxes, window resize end). Throttle runs *at most once every N ms during activity* (scroll position, drag events).

### 2. Race conditions and stale responses

Network responses don't always arrive in the order they were sent. If the "rea" request is slow and "react" is fast, the old "rea" results could overwrite the newer ones.

The fix is an `ignore` flag: the effect cleanup sets it to `true`, so a response from an outdated request is simply dropped. The same pattern protects every API call in [useAsync.js](src/utils/useAsync.js).

### 3. CORS and JSONP

Google's autocomplete endpoint doesn't send an `Access-Control-Allow-Origin` header, so the browser blocks a normal `fetch()`:

```
Access to fetch ... has been blocked by CORS policy
```

**CORS** is a browser security rule: a page can only read responses from another origin if that server allows it. `<script>` tags are exempt, which is what **JSONP** uses. We tell the server to wrap its JSON in a function call we name, then load it as a script ([searchSuggestions.js](src/utils/searchSuggestions.js)):

```js
window[callbackName] = (data) => {
  resolve(data[1].map((item) => item[0]));
};
script.src = SUGGEST_URL + encodeURIComponent(query) + "&callback=" + callbackName;
document.body.appendChild(script);
// Server responds with:  __ytSuggest0 && __ytSuggest0(["react", [...]])
```

It also covers cleanup (removing the script and callback) and a timeout for requests that never answer. The YouTube Data API itself *does* support CORS, so it uses plain `fetch`.

### 4. Caching and request de-duplication

API calls are cached by key in a `Map`. The **promise** is stored, not the result, so two components asking for the same data at the same time share one request. Failed requests are removed so "Try again" really retries ([youtubeApi.js](src/utils/youtubeApi.js)):

```js
const cached = (key, load) => {
  if (!cache.has(key)) {
    cache.set(key, load().catch((error) => {
      cache.delete(key);
      throw error;
    }));
  }
  return cache.get(key);
};
```

Going back to a category or repeating a search is instant and costs no API quota.

### 5. Accessible, keyboard-friendly autocomplete

- `role="combobox"`, `role="listbox"`, `role="option"` and `aria-activedescendant` let screen readers announce the highlighted suggestion.
- ↑ / ↓ move the highlight, **Enter** picks it, **Esc** closes the list.
- **The `onMouseDown` trick:** clicking a suggestion blurs the input, and `onBlur` hides the list *before* `onClick` fires, so the click is lost. Handling `onMouseDown` (which fires before blur) fixes it:

```jsx
<li onMouseDown={(e) => { e.preventDefault(); selectSuggestion(suggestion); }}>
```

### 6. Global state with Redux Toolkit

State that many unrelated components need lives in one slice ([appSlice.js](src/utils/appSlice.js)): whether the desktop sidebar is expanded, whether the mobile drawer is open, and the current theme.

```js
const theme = useSelector((store) => store.app.theme); // read anywhere
dispatch(setTheme("dark"));                             // update from anywhere
```

`createSlice` generates the actions for you and lets reducers "mutate" state safely (Immer handles immutability under the hood).

### 7. Routing with React Router 7

- **Nested routes + `<Outlet />`:** the header, sidebar and footer stay mounted while only the page content changes ([App.js](src/App.js), [Body.js](src/components/Body.js)).
- **The URL as state:** the search query (`?search_query=`), category (`?category=`) and video id (`?v=`) live in the URL via `useSearchParams`, so pages can be refreshed, bookmarked and shared, and back/forward just works.
- **Passing data through navigation:** cards send the video object along, so the watch page shows details instantly without another request:

```jsx
<Link to={"/watch?v=" + video.id} state={{ video }}>
```

- **`<ScrollRestoration />`:** new pages start at the top, and "back" restores your scroll position.
- **Catch-all route** `path: "*"` renders the 404 page.

### 8. Custom hooks

- **`useAsync(load, deps)`** wraps any async call and returns `{ status, data, error, retry }`, so every page handles loading, success and error states the same way ([useAsync.js](src/utils/useAsync.js)).
- **`useMediaQuery(query)`** tracks a CSS media query from JavaScript using React's `useSyncExternalStore`, the recommended way to subscribe to external sources like `window.matchMedia` ([useMediaQuery.js](src/utils/useMediaQuery.js)). The header uses it to decide whether the menu button collapses the sidebar (desktop) or opens the drawer (mobile).

### 9. Shimmer (skeleton) UI

Instead of a spinner, the page shows gray placeholders **shaped like the real content** with a light sweep moving across them. The layout doesn't jump when data arrives, and the app *feels* faster (better perceived performance).

The effect is one reusable Tailwind utility ([style.css](style.css)) that adapts to dark mode and respects `prefers-reduced-motion`:

```css
@utility shimmer {
  background-color: var(--app-surface);
  &::after {
    background-image: linear-gradient(90deg, transparent, var(--app-shimmer), transparent);
    animation: shimmer 1.4s ease-in-out infinite;
  }
}
```

```jsx
<div className="shimmer aspect-video rounded-xl" /> // placeholder thumbnail
```

See [Shimmer.js](src/components/Shimmer.js) for the grid, search row, compact card and watch-page skeletons.

### 10. Dark mode done right

- **CSS variables as design tokens:** colors are defined once for light (`:root`) and dark (`.dark`), then exposed to Tailwind as `bg-app`, `bg-surface`, `text-fg`, `text-muted`, `border-line`. Components never need `dark:` classes for basic colors.

```css
@custom-variant dark (&:where(.dark, .dark *));
:root { --app-bg: #ffffff; }
.dark { --app-bg: #0f0f0f; }
@theme inline { --color-app: var(--app-bg); }
```

- **No flash of the wrong theme:** a tiny inline script in [index.html](index.html) applies the saved theme *before* the page paints, before React even loads.
- **Remembering the choice:** saved to `localStorage`; with no saved choice it follows the system setting (`prefers-color-scheme`).

### 11. Responsive design: breakpoints and container queries

- **Breakpoints** (`md:`, `lg:`) switch the layout: drawer + mobile search on phones, icon rail on tablets, full sidebar on desktop.
- **Container queries** (`@container`, `@xl:`, `@4xl:`) size the video grid by the width of `<main>` instead of the whole screen. Collapsing the sidebar gives the grid more room, and it goes from 3 to 4 columns automatically:

```jsx
<main className="@container ...">
<div className="grid grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-3 @6xl:grid-cols-4">
```

### 12. Working with a real-world API

- **Environment variables:** the key lives in `.env` and is read as `process.env.YOUTUBE_API_KEY` (Parcel inlines it at build time).
- **Designing around quota:** `search.list` costs 100 units while `videos.list` costs 1, so search asks only for video ids, then fetches views, durations and titles in one cheap `videos.list` call. And since a search call costs the same whether it returns 5 or 50 results, each search page asks for the maximum 50.
- **Human-friendly errors:** API error codes like `API_KEY_INVALID` or `quotaExceeded` are mapped to clear messages, with a "Try again" button.
- **Graceful fallback:** if trending videos fail, sample videos are shown so the app is never empty.

### 13. Small performance wins

- `loading="lazy"` on thumbnails, so images below the fold load only when you scroll near them.
- One `channels.list` call fetches up to 50 channel pictures at once instead of one request per video.
- Cached results and data passed through navigation avoid duplicate requests.

### 14. Infinite scroll with IntersectionObserver and page tokens

Both the home page and search results load more videos as you scroll.

**Pagination with tokens:** the API returns one page of results (24 trending videos, or 50 search results) plus a `nextPageToken`. Sending that token back returns the next page. When no token comes back, you've reached the end ([youtubeApi.js](src/utils/youtubeApi.js)).

**One hook for every feed:** `useVideoFeed(cacheKey, fetchPage)` knows nothing about trending or search. Each page passes in how to fetch a page, and the hook handles the rest ([useVideoFeed.js](src/utils/useVideoFeed.js)):

```js
// Home page
useVideoFeed(`popular:${category.slug}`, (pageToken) =>
  fetchPopularVideos(category.categoryId, pageToken));

// Search results
useVideoFeed(`search:${query.toLowerCase()}`, (pageToken) =>
  searchVideos(query, pageToken));
```

**Detecting the bottom without scroll events:** an invisible marker sits after the grid, and an `IntersectionObserver` reports when it comes near the screen. This is cheaper than listening to every `scroll` event and measuring positions by hand ([InfiniteScrollTrigger.js](src/components/InfiniteScrollTrigger.js)):

```js
const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) onVisible(); // load the next page
  },
  { rootMargin: "800px" } // start 800 px early, so the user rarely waits
);
observer.observe(markerRef.current);
```

Search uses a smaller head start (`400px`): a search page costs 102 quota units against 2 for trending, so it waits until you're closer to the bottom before spending them.

**The details that make it feel right** ([useVideoFeed.js](src/utils/useVideoFeed.js)):

- **No double loads:** a ref is updated to "loadingMore" immediately, so a second trigger before React re-renders is ignored.
- **No duplicates:** results can shift between requests, so videos already on screen are filtered out when a new page is added.
- **No stale pages:** switching category or search bumps a counter, and late responses for the old one are thrown away.
- **No retry loops:** after a failed page, the marker is removed and a "Try again" button appears instead.
- **No empty-page loops:** an empty page ends the feed, even if YouTube still sends another token.
- **Back button keeps your place:** loaded pages are kept in memory, so returning from a video restores the full list and your scroll position.
- **Shimmer placeholders** fill in while a page loads, and "You're all caught up" (home) or "No more results" (search) appears at the end.

---

## 📊 API Quota Usage

The YouTube Data API gives **10,000 free units per day** (reset at midnight Pacific Time).

| Action | API calls | Units |
|---|---|---|
| Open home or a category | `videos.list` + `channels.list` | 2 |
| Scroll to load 24 more videos | `videos.list` + `channels.list` | 2 |
| Search (first 50 results) | `search.list` + `videos.list` + `channels.list` | 102 |
| Scroll to load 50 more search results | `search.list` + `videos.list` + `channels.list` | 102 |
| Open a watch link directly | `videos.list` + `channels.list` | 2 |
| Repeat any of the above in the same session | served from cache | 0 |
| Autocomplete suggestions | Google Suggest, not the Data API | 0 |

That is roughly **95 search pages a day** (about 4,500 results), plus plenty of browsing. Search pages are the expensive part, so scrolling deep into search results uses quota much faster than the home page.

---

## 🧯 Troubleshooting

| Problem | Fix |
|---|---|
| "No YouTube API key found" | Create `.env` with `YOUTUBE_API_KEY=...` and restart `npm start`. |
| "Your YouTube API key is not valid" | Check the key for typos or extra spaces in `.env`. |
| "YouTube Data API v3 is not enabled" | Enable it in the Google Cloud Console for the key's project. |
| "The daily YouTube API quota is used up" | Wait for the reset at midnight Pacific Time. |
| "This API key's restrictions don't allow requests" | Add your site (e.g. `http://localhost:1234/*`) to the key's website restrictions. |
| `Failed to resolve 'react-router/dom'` | Already fixed: `package.json` enables `"packageExports"` for Parcel, which React Router 7 needs. |
| Dev server stops with `ENOENT ... unlink` on Windows | A Parcel file-watcher hiccup when many files change at once. Run `npm start` again. |
| Deployed site says "No YouTube API key found" | Add `YOUTUBE_API_KEY` in Vercel → Settings → Environment Variables, then **redeploy**. |
| Deployed site says the key's restrictions block requests | Add your `*.vercel.app` address to the key's website restrictions in Google Cloud. |
| Vercel shows 404 when refreshing `/watch` or `/results` | Make sure `vercel.json` (with the `rewrites` rule) is committed to the repo. |
| Vercel: `Command "npm run build" exited with SIGSEGV` right after `✨ Built in ...` | Parcel crashing on shutdown on Linux. The `buildCommand` in `vercel.json` handles it; make sure it's committed. |
| Deployed page is blank, and the JS bundle is only about 35 kB | Don't add `"engines": { "node": ... }` to `package.json`: Parcel then builds for Node.js instead of the browser and leaves React out of the bundle. Set the Node version in Vercel's project settings instead. |

> **Security note:** in a frontend-only app the API key is included in the JavaScript sent to the browser, so anyone can find it. Always restrict the key to your website and to the YouTube Data API. For full protection, move API calls behind your own backend.

---

## 💡 Ideas to Extend

- Search filters (upload date, duration, sort order) using `search.list` parameters
- Comments on the watch page (`commentThreads.list`)
- Watch history and "liked videos" saved in Redux or `localStorage`
- A Shorts page with vertical, swipeable videos
- A small backend proxy to keep the API key private

---

## 👤 Author

**Mohil Kumar**: [github.com/MOHILKUMAR](https://github.com/MOHILKUMAR)

Video data comes from the YouTube Data API. This project is for learning and is not affiliated with YouTube or Google.
