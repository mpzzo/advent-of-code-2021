import { parse } from "https://deno.land/std@0.116.0/flags/mod.ts"
import runners from "./src/runners.ts"

const [command, ...args] = Deno.args
const runner = runners[Number.parseInt(command) - 1]

if (!runner) {
    console.error("Runner not found for day", command)
} else {
    console.info("Running day", command)
    console.info(await runner(Deno.stdin, parse(args)))
}