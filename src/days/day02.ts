import { Input, OptionSelector } from "../input.ts"

type Path = {
    direction: string,
    units: number
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

export async function run (input: Input, options: OptionSelector) {
    const withAim = options.boolean(['w', 'withAim'], false)
    const course = input.map((l) => {
        const [ direction, units ] = l.split(' ')
        return { 
            direction,
            units: Number.parseInt(units)
        }
    })
    const result = await (withAim ? getPositionAndDepthWithAim(course) : getPositionAndDepth(course))
    return result
}