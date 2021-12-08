import { run as day01 } from "./days/day01.ts"
import { run as day02 } from "./days/day02.ts"
import { run as day03 } from "./days/day03.ts"
import { run as day04 } from "./days/day04.ts"
import { Input, OptionSelector } from "./input.ts"

// deno-lint-ignore no-explicit-any
type Runner = (input: Deno.Reader, options?: Record<string, unknown>) => any

// deno-lint-ignore no-explicit-any
type RunnerV2 = (input: Input, options: OptionSelector) => any

function convertV2toV1(runner: RunnerV2): Runner {
    return (input, options) => runner(new Input(input), new OptionSelector({ _:[], ...options }))
}

const runners: Runner[] = [
    convertV2toV1(day01),
    convertV2toV1(day02),
    day03,
    day04
]

export default runners