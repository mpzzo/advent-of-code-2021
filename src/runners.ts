import { run as day01 } from "./days/day01.ts"
import { run as day02 } from "./days/day02.ts"
import { run as day03 } from "./days/day03.ts"
import { run as day04 } from "./days/day04.ts"
import { Input, OptionSelector } from "./input.ts"

// deno-lint-ignore no-explicit-any
type Runner = (input: Input, options: OptionSelector) => any

const runners: Runner[] = [
    day01,
    day02,
    day03,
    day04
]

export default runners