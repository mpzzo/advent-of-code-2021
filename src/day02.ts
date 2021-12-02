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

export async function getPositionAndDepth(course: AsyncIterable<Path>) {
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

export async function getPositionAndDepthWithAim(course: AsyncIterable<Path>) {
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

export async function run(input: Deno.Reader) {
    const course = pathsGenerator(input)
    // Part One:
    // const result = await getPositionAndDepth(course)
    // Part Two:
    const result = await getPositionAndDepthWithAim(course)
    console.log(result)
}