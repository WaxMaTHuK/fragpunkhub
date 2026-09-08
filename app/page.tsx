import { listPosts } from "@/db/content";
import { DEFAULT_POSTS } from "@/lib/hub-content";
import { HubClient } from "./hub-client";

export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    const posts = await listPosts(false);
    return <HubClient initialPosts={posts} />;
  } catch {
    const fallbackPosts = DEFAULT_POSTS.map((post) => ({
      ...post,
      updatedAt: "2026-09-04T00:00:00.000Z",
    }));
    return <HubClient initialPosts={fallbackPosts} storageUnavailable />;
  }
}
