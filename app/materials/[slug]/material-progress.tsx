"use client";

import { useEffect } from "react";

export function MaterialProgress({ postId }: { postId: string }) {
  useEffect(() => {
    void fetch("/api/progress/read", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ postId }) });
  }, [postId]);
  return null;
}
