import { afterAll, beforeAll, describe, expect, it } from "vitest"
import type { UnstableDevWorker } from "wrangler"
import { unstable_dev } from "wrangler"

describe("Worker", () => {
    let worker: UnstableDevWorker

    beforeAll(async () => {
        worker = await unstable_dev("src/index.ts", {
            experimental: { disableExperimentalWarning: true },
        })
    })

    afterAll(async () => {
        await worker.stop()
    })

    it("should not cache", async () => {
        const resp = await worker.fetch()
        if (resp) {
            expect(resp.headers.get("Cache-Control")).toBe("no-cache")
        }
    })
})
