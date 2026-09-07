/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  MAINTENANCE_MODE?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

function maintenancePage(): Response {
  return new Response(`<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>FragPunk Hub — технические работы</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:radial-gradient(circle at 50% -10%,#402259 0,transparent 38rem),#09070e;color:#f8f5ff;font-family:Inter,system-ui,sans-serif}.card{width:min(520px,calc(100% - 48px));border:1px solid rgba(255,255,255,.13);border-radius:20px;padding:36px;background:rgba(21,17,30,.94);box-shadow:0 28px 90px rgba(0,0,0,.48)}.brand{display:flex;align-items:center;gap:12px;color:#dcff3f;font-size:.78rem;font-weight:900;letter-spacing:.15em}.bolt{width:28px;height:32px;background:#dcff3f;clip-path:polygon(18% 0,100% 0,76% 44%,100% 44%,18% 100%,34% 56%,0 56%)}h1{margin:32px 0 14px;font-size:clamp(2.5rem,9vw,4.4rem);line-height:.91;letter-spacing:-.07em}p{margin:0;color:#b8b0c6;font-size:1.04rem;line-height:1.6}.line{width:44px;height:4px;margin:27px 0 14px;background:#dcff3f}.small{font-size:.84rem;color:#8f879e}</style></head><body><main class="card"><div class="brand"><span class="bolt"></span><span>FRAGPUNK<br>HUB.RU</span></div><div class="line"></div><h1>Технические<br>работы</h1><p>Сайт готовится к следующему обновлению. Скоро вернёмся с новыми материалами.</p><p class="small" style="margin-top:24px">Спасибо, что заглянули.</p></main></body></html>`, {
    status: 503,
    headers: { "content-type": "text/html; charset=UTF-8", "cache-control": "no-store", "retry-after": "3600" },
  });
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    const adminOrAssetRequest = url.pathname.startsWith("/admin") || url.pathname.startsWith("/api/admin") || url.pathname.startsWith("/_vinext") || url.pathname === "/favicon.svg";
    if (env.MAINTENANCE_MODE === "on" && !adminOrAssetRequest) return maintenancePage();

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
