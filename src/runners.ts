import { run as day01 } from "./days/day01.ts"
import { run as day02 } from "./days/day02.ts"
import { run as day03 } from "./days/day03.ts"
import { run as day04 } from "./days/day04.ts"

// deno-lint-ignore no-explicit-any
type Runner = (input: Deno.Reader, options?: Record<string, unknown>) => any

const runners: Runner[] = [
    day01,
    day02,
    day03,
    day04
]

export default runners