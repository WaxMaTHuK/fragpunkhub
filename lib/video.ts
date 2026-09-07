export function youtubeEmbedUrl(value: string) {
  try {
    const url = new URL(value);
    let videoId = "";
    if (url.hostname === "youtu.be") videoId = url.pathname.slice(1);
    if (url.hostname.endsWith("youtube.com")) videoId = url.searchParams.get("v") || url.pathname.match(/^\/(?:shorts|embed)\/([^/?]+)/)?.[1] || "";
    return /^[a-zA-Z0-9_-]{6,}$/.test(videoId) ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
  } catch { return null; }
}
