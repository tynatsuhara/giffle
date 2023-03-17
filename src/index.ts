/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
    // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
    // MY_KV_NAMESPACE: KVNamespace;
    //
    // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
    // MY_DURABLE_OBJECT: DurableObjectNamespace;
    //
    // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
    // MY_BUCKET: R2Bucket;
    //
    // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
    // MY_SERVICE: Fetcher;
}

const DEFAULT_URL = new URL("https://i.giphy.com/media/TO8WGuVadRniy794oY/giphy.webp")

const RESPONSE_HEADERS = {
    Expires: "Mon, 01 Jan 1990 00:00:00 GMT",
    "Cache-Control": "no-cache",
    "access-control-allow-origin": "*",
    "cross-origin-resource-policy": "cross-origin",
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = getUrlFromRequest(request)
        const headers = Object.fromEntries(request.headers.entries())
        const response = await fetch(url, { headers })
        return new Response(response.body, {
            headers: {
                ...RESPONSE_HEADERS,
                ["Content-Type"]: response.headers.get("Content-Type") ?? "image/gif",
            },
        })
    },
}

const getUrlFromRequest = (request: Request): URL => {
    const qsIndex = request.url.indexOf("?")
    if (qsIndex === -1) {
        return DEFAULT_URL
    }

    const params = new URLSearchParams(request.url.substring(qsIndex + 1))
    const options = params.get("options")?.split(",")
    if (!options?.length) {
        return DEFAULT_URL
    }

    try {
        return new URL(options[Math.floor(Math.random() * options.length)])
    } catch (e) {
        return DEFAULT_URL
    }
}
