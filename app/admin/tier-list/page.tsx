import "@/app/tier-list/tier.css";
import { redirect } from 'next/navigation';
import { hasAdminSession } from '@/app/admin-auth';
import { readTierList } from '@/db/tier-list';
import { TierEditor } from './tier-editor';
export const dynamic='force-dynamic';
export default async function Page(){if(!await hasAdminSession())redirect('/admin/login');return <TierEditor initial={await readTierList()}/>;}
