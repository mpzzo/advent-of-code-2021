import { Input, parseArgs } from "./src/input.ts"
import runners from "./src/runners.ts"

const [command, ...args] = Deno.args
const runner = runners[Number.parseInt(command)]

if (!runner) {
    console.error("Runner not found for day", command)
} else {
    console.info("Running day", command)
    console.info(await runner(
        new Input(Deno.stdin),
        parseArgs(args)
    ))
}