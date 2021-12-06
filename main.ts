import { parse } from "https://deno.land/std@0.116.0/flags/mod.ts"
import runners from "./src/runners.ts"

const {
    _,
    ...options
} = parse(Deno.args)

for (const key of _) {
    const runner = runners[key]
    if (!runner) {
        console.error("Runner not found:", key)
    } else {
        console.info("Running", key)
        console.info(await runner(Deno.stdin, options))
    }
}