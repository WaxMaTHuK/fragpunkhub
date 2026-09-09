import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { getOrCreateProfile } from "@/db/profile";
import { ProfileClient } from "./profile-client";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requireChatGPTUser("/profile");
  const profile = await getOrCreateProfile(user.id, user.fullName ?? user.email.split("@")[0] ?? "Лансер");
  return <ProfileClient initialProfile={profile} />;
}
