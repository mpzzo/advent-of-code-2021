import { readLines } from "https://deno.land/std@0.116.0/io/mod.ts"

type Path = {
    direction: string,
    units: number
}

async function* pathsGenerator(input: Deno.Reader) {
    for await (const l of readLines(input)) {
        const [ direction, units ] = l.split(' ')
        yield { 
            direction,
            units: Number.parseInt(units)
        }
    }
}

async function getPositionAndDepth(course: AsyncIterable<Path>) {
    let position = 0
    let depth = 0
    for await (const { direction, units } of course) {
        if (direction === "forward") {
            position += units
        } else if (direction === "down") {
            depth += units
        } else if (direction === "up") {
            depth -= units
        }
    }
    return position * depth
}

async function getPositionAndDepthWithAim(course: AsyncIterable<Path>) {
    let position = 0
    let depth = 0
    let aim = 0
    for await (const { direction, units } of course) {
        if (direction === "forward") {
            position += units
            depth += aim * units
        } else if (direction === "down") {
            aim += units
        } else if (direction === "up") {
            aim -= units
        }
    }
    return position * depth
}

interface RunOptions {
    withAim?: boolean
}

export async function run(input: Deno.Reader, options?: RunOptions) {
    const { 
        withAim = false
    } = options ?? {}

    const course = pathsGenerator(input)
    const result = await (withAim ? getPositionAndDepthWithAim(course) : getPositionAndDepth(course))

    console.log(result)
    return result
}