import { run as day01 } from "./day01.ts"
import { run as day02 } from "./day02.ts"

type Runner = (input: Deno.Reader, options?: Record<string, unknown>) => void

const runners: Record<string, Runner> = {
    day01,
    day02
}

export default runners