import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getOrCreateProfile } from "@/db/profile";
import { getPlayerBySession } from "@/db/player-auth";
import { ProfileClient } from "./profile-client";
export const dynamic = "force-dynamic";
export default async function ProfilePage() { const c=await cookies(); const player=await getPlayerBySession(c.get("fp_player")?.value); if(!player) redirect("/auth"); const profile=await getOrCreateProfile(player.userId,"Лансер"); return <ProfileClient initialProfile={profile}/>; }
