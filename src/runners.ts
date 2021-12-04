import { run as day01 } from "./days/day01.ts"
import { run as day02 } from "./days/day02.ts"

type Runner = (input: Deno.Reader, options?: Record<string, unknown>) => void

const runners: Record<string, Runner> = {
    day01,
    day02
}

export default runners