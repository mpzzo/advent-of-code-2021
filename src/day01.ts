import { readLines } from "https://deno.land/std@0.116.0/io/mod.ts"

export async function getDepthIncreases(depths: AsyncIterable<number>, windowSize = 1): Promise<number> {
    if (windowSize < 1) {
        return 0
    }

    let count = 0
    let prev = null
    let window = new Array<number>()
    for await (const depth of depths) {
        window = window.map((sum) => sum + depth)
        window.push(depth)
        if (window.length > windowSize - 1) {
            const sum = window.shift() as number
            if (prev !== null) {
                count += sum > prev ? 1 : 0
            }
            prev = sum
        }
    }
    return count
}

async function* depthsGenerator(input: Deno.Reader) {
    for await (const l of readLines(input)) {
        yield Number.parseInt(l)
    }
}

export async function run(input: Deno.Reader) {
    const depths = depthsGenerator(input)
    // Part One:
    // const result = await getDepthIncreases(depths)
    // Part Two:
    const result = await getDepthIncreases(depths, 3)
    console.log(result)
}