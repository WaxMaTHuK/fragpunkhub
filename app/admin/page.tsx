import { listPosts } from "@/db/content";
import { redirect } from "next/navigation";
import { hasAdminSession } from "../admin-auth";
import { AdminClient } from "./admin-client";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await hasAdminSession())) redirect("/admin/login");
  const posts = await listPosts(true);
  return <AdminClient initialPosts={posts} userName="WaxMaTHuK" signOutPath="/api/admin/logout" />;
}
