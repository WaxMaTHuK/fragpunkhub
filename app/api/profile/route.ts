import { cookies } from "next/headers";
import { getOrCreateProfile, updateProfile } from "@/db/profile";
import { getPlayerBySession } from "@/db/player-auth";
export async function POST(request: Request) { const c=await cookies(); const user=await getPlayerBySession(c.get("fp_player")?.value); if(!user) return Response.json({error:"Нужно войти"},{status:401}); const body=await request.json().catch(()=>null); if(!body||typeof body!=="object") return Response.json({error:"Некорректные данные"},{status:400}); await getOrCreateProfile(user.userId,"Лансер"); return Response.json(await updateProfile(user.userId,{nickname:String(body.nickname??""),avatar:String(body.avatar??"⚡"),frame:String(body.frame??"acid"),gameRank:String(body.gameRank??"Новичок")})); }
