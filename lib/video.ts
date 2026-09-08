export function youtubeEmbedUrl(value: string) {
  try {
    const url = new URL(value);
    let videoId = "";
    if (url.hostname === "youtu.be") videoId = url.pathname.slice(1);
    if (url.hostname.endsWith("youtube.com")) videoId = url.searchParams.get("v") || url.pathname.match(/^\/(?:shorts|embed)\/([^/?]+)/)?.[1] || "";
    return /^[a-zA-Z0-9_-]{6,}$/.test(videoId) ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
  } catch { return null; }
}

export function uploadedImageUrl(value: string) {
  try {
    const url = new URL(value);
    const isGithubImage = url.hostname === "raw.githubusercontent.com" || url.hostname === "github.com";
    const isImage = /\.(?:jpg|jpeg|png|webp)(?:$|\?)/i.test(url.pathname);
    return (isGithubImage && isImage) ? url.toString() : null;
  } catch { return null; }
}
