import { Input, OptionSelector } from "../input.ts"

async function getDepthIncreases(depths: AsyncIterable<number>, windowSize: number): Promise<number> {
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

export async function run (input: Input, options: OptionSelector) {
    const windowSize = options.number(['w', 'windowSize'], 1)
    return await getDepthIncreases(input.map(s => Number.parseInt(s)), windowSize)
}