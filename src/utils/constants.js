export const REGION_CODE = "IN";
export const REPO_URL = "https://github.com/MOHILKUMAR/Video-app";

// YouTube video category ids. Education (27) and Travel (19) have no
// trending chart for India, so they are left out.
export const CATEGORIES = [
  { slug: "all", label: "All", categoryId: null },
  { slug: "music", label: "Music", categoryId: "10" },
  { slug: "gaming", label: "Gaming", categoryId: "20" },
  { slug: "sports", label: "Sports", categoryId: "17" },
  { slug: "news", label: "News", categoryId: "25" },
  { slug: "entertainment", label: "Entertainment", categoryId: "24" },
  { slug: "comedy", label: "Comedy", categoryId: "23" },
  { slug: "tech", label: "Tech", categoryId: "28" },
  { slug: "movies", label: "Movies", categoryId: "1" },
  { slug: "lifestyle", label: "Lifestyle", categoryId: "26" },
  { slug: "autos", label: "Autos", categoryId: "2" },
  { slug: "pets", label: "Pets", categoryId: "15" },
];

export const getCategory = (slug) =>
  CATEGORIES.find((category) => category.slug === slug) ?? CATEGORIES[0];

export const getCategoryPath = (slug) =>
  slug === "all" ? "/" : `/?category=${slug}`;

// Shown when the YouTube API can't be reached (no key, quota used up...).
export const SAMPLE_VIDEOS = [
  { id: "jNQXAC9IVRw", title: "Me at the zoo", channel: "jawed" },
  {
    id: "aqz-KE-bpKQ",
    title: "Big Buck Bunny 60fps 4K - Official Blender Foundation Short Film",
    channel: "Blender",
  },
  {
    id: "LXb3EKWsInQ",
    title: "COSTA RICA IN 4K 60fps HDR (ULTRA HD)",
    channel: "Jacob + Katie Schwarz",
  },
  {
    id: "M7lc1UVf-VE",
    title: "YouTube Developers Live: Embedded Web Player Customization",
    channel: "Google for Developers",
  },
  { id: "YE7VzlLtp-4", title: "Big Buck Bunny", channel: "Blender" },
  {
    id: "dQw4w9WgXcQ",
    title: "Rick Astley - Never Gonna Give You Up (Official Video) (4K Remaster)",
    channel: "Rick Astley",
  },
];

export const getThumbnailUrl = (videoId) =>
  `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
