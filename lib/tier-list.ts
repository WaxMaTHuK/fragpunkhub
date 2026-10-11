import { LANCER_ASSETS } from './lancer-assets';
export const GRADES = ['S','A','B','C','D'] as const;
export type Grade = typeof GRADES[number];
export type TierList = { title: string; patch: string; mode: string; description: string; published: boolean; rows: Record<Grade,string[]>; notes: Record<string,string> };
const PORTRAITS: Record<string,number> = {Broker:1,Nitro:2,Counterfeit:3,Jaguar:4,Chum:5,Corona:6,Serket:7,Pathojen:8,Dex:9,Spider:10,Kismet:11,Axon:12,Zephyr:13,Hurricane:14,Sonar:15,Hollowpoint:16,Ixchel:17,Calamity:18,Windwalker:19,Wildstyle:20,Aura:21};
export const TIER_LANCERS = LANCER_ASSETS.map(x => ({id:x.english,name:x.name,image:`/images/lancers/character_icon_${String(PORTRAITS[x.english]).padStart(2,'0')}.png`}));
export function emptyTierList(): TierList { return {title:'Тир-лист лансеров',patch:'',mode:'Рейтинговый режим',description:'Редакторский рейтинг. Состав команды и карта влияют на выбор лансера.',published:false,rows:{S:[],A:[],B:[],C:[],D:[]},notes:{}}; }
export function validateTierList(value: unknown): value is TierList {
 const x = value as TierList;
 if (!x || typeof x.title !== 'string' || !x.title.trim() || x.title.length > 140 || typeof x.patch !== 'string' || x.patch.length > 100 || typeof x.mode !== 'string' || x.mode.length > 100 || typeof x.description !== 'string' || x.description.length > 2000 || typeof x.published !== 'boolean' || !x.rows || !x.notes || typeof x.notes !== 'object' || Array.isArray(x.notes)) return false;
 const all:string[]=[];
 for (const grade of GRADES) {if(!Array.isArray(x.rows[grade])) return false; all.push(...x.rows[grade]);}
 return all.every(id=>TIER_LANCERS.some(l=>l.id===id)) && new Set(all).size===all.length && Object.entries(x.notes).every(([id,n])=>TIER_LANCERS.some(l=>l.id===id) && typeof n==='string' && n.length<=1000);
}
