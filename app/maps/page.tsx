import { listPosts } from "@/db/content";
import { DEFAULT_POSTS } from "@/lib/hub-content";
import { youtubeEmbedUrl, uploadedImageUrl } from "@/lib/video";
export const dynamic = "force-dynamic";
export default async function MapsPage() {
  let maps = DEFAULT_POSTS.filter((post) => post.type === "map");
  try { maps = (await listPosts(false)).filter((post) => post.type === "map"); } catch {}
  return <main className="wrap material-page"><a className="back-link" href="/">← На главную</a><h1 className="maps-title">Карты</h1><section className="map-list">{maps.map((map) => { const lines=map.content.split("\n").map(x=>x.trim()).filter(Boolean); const image=lines.find(uploadedImageUrl); const video=lines.find(youtubeEmbedUrl); return <article className="map-entry" key={map.id}><div className="map-image">{image?<img src={image} alt={map.title}/>:<>Добавь картинку карты<br/>в редакторе</>}</div><div className="map-info"><h2>{map.title}</h2><p>{map.summary}</p>{lines.filter(x=>x!==image&&x!==video).map((x,i)=><p key={i}>{x}</p>)}{video&&<div className="video-embed"><iframe src={youtubeEmbedUrl(video)!} title={map.title} allowFullScreen/></div>}</div></article>})}</section></main>;
}
