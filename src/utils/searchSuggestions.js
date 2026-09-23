// YouTube's autocomplete endpoint doesn't send CORS headers, so a plain
// fetch() from the browser is blocked. It does support JSONP: the response
// is wrapped in a callback we name, and loaded through a <script> tag.
const SUGGEST_URL =
  "https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=";
const TIMEOUT_MS = 5000;

const cache = new Map();
let callbackId = 0;

export const fetchSuggestions = (query) => {
  if (cache.has(query)) return Promise.resolve(cache.get(query));

  return new Promise((resolve, reject) => {
    const callbackName = "__ytSuggest" + callbackId++;
    const script = document.createElement("script");

    const timer = setTimeout(() => {
      // The script may still arrive later; leave a no-op so it doesn't throw.
      window[callbackName] = () => {};
      script.remove();
      reject(new Error("Search suggestions timed out"));
    }, TIMEOUT_MS);

    window[callbackName] = (data) => {
      clearTimeout(timer);
      delete window[callbackName];
      script.remove();

      // data looks like: ["query", [["suggestion", 0, [...]], ...], {...}]
      const suggestions = data[1].map((item) => item[0]);
      cache.set(query, suggestions);
      resolve(suggestions);
    };

    script.onerror = () => {
      clearTimeout(timer);
      delete window[callbackName];
      script.remove();
      reject(new Error("Search suggestions failed to load"));
    };

    script.src =
      SUGGEST_URL + encodeURIComponent(query) + "&callback=" + callbackName;
    document.body.appendChild(script);
  });
};
