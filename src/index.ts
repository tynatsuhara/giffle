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

const GIFFLE_DOMAIN = "https://giffle.ty.pizza"

const DEFAULT_URL = new URL("https://i.giphy.com/media/TO8WGuVadRniy794oY/giphy.webp")

const RESPONSE_HEADERS = {
    Expires: "Mon, 01 Jan 1990 00:00:00 GMT",
    "Cache-Control": "no-cache",
    "access-control-allow-origin": "*",
    "cross-origin-resource-policy": "cross-origin",
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const params = getUrlParams(request)

        await maybeBustGithubCache(params)

        const url = getUrlFromRequest(params)
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

const maybeBustGithubCache = async (params: URLSearchParams) => {
    const bustUrl = params.get("bust_github_cache")
    if (!bustUrl) {
        return
    }
    const response = await fetch(bustUrl)
    const html = await response.text()

    const camoUrls = []

    for (let startIndex = 0; startIndex !== -1; ) {
        const imgSrcPrefix = `<img src="`
        const imgStart = html.indexOf(
            `${imgSrcPrefix}https://camo.githubusercontent.com/`,
            startIndex
        )
        if (imgStart === -1) {
            break
        }
        const srcPrefix = `data-canonical-src="`
        const srcStart = html.indexOf(srcPrefix, imgStart) + srcPrefix.length
        const srcEnd = html.indexOf(`"`, srcStart)
        const canonicalSrc = html.substring(srcStart, srcEnd)
        if (canonicalSrc.startsWith(GIFFLE_DOMAIN)) {
            const camoSrcEnd = html.indexOf(`"`, imgStart + imgSrcPrefix.length)
            const camoSrc = html.substring(imgStart + imgSrcPrefix.length, camoSrcEnd)
            camoUrls.push(camoSrc)
        }
        startIndex = srcEnd
    }

    console.log(`purging ${camoUrls.length} URLs from ${bustUrl}`)

    await Promise.all(
        camoUrls.map((url) => {
            return fetch(url, { method: "PURGE" })
        })
    )
}

const getUrlParams = (request: Request) => {
    const qsIndex = request.url.indexOf("?")
    if (qsIndex === -1) {
        return new URLSearchParams()
    }
    return new URLSearchParams(request.url.substring(qsIndex + 1))
}

const getUrlFromRequest = (params: URLSearchParams): URL => {
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
