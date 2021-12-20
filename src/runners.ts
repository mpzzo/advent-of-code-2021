import { Input, OptionSelector } from "./input.ts"
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
import { run as day11 } from "./days/day11.ts"
import { run as day12 } from "./days/day12.ts"
import { run as day13 } from "./days/day13.ts"
import { run as day14 } from "./days/day14.ts"
import { run as day15 } from "./days/day15.ts"
import { run as day16 } from "./days/day16.ts"

// deno-lint-ignore no-explicit-any
type Runner = (input: Input, options: OptionSelector) => any

const runners: {[key: number]: Runner} = {1:day01,2:day02,3:day03,4:day04,5:day05,6:day06,7:day07,8:day08,9:day09,10:day10,11:day11,12:day12,13:day13,14:day14,15:day15,16:day16}
export default runners