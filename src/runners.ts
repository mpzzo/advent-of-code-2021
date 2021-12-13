import { run as day01 } from "./days/day01.ts"
import { run as day02 } from "./days/day02.ts"
import { run as day03 } from "./days/day03.ts"
import { run as day04 } from "./days/day04.ts"
import { run as day05 } from "./days/day05.ts"
import { run as day06 } from "./days/day06.ts"
import { run as day07 } from "./days/day07.ts"
import { run as day08 } from "./days/day08.ts"
import { run as day09 } from "./days/day09.ts"
import { run as day10 } from "./days/day10.ts"
import { Input, OptionSelector } from "./input.ts"

// deno-lint-ignore no-explicit-any
type Runner = (input: Input, options: OptionSelector) => any

const runners: Runner[] = [
    day01,
    day02,
    day03,
    day04,
    day05,
    day06,
    day07,
    day08,
    day09,
    day10
]

export default runners