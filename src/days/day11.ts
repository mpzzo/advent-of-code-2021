import { Input, OptionSelector } from "../input.ts"

interface StepResult {
    nextLevels: number[][],
    flashCount: number
}

type FlashTarget = [number, number]

export function step(levels: number[][]): StepResult {
    let flashes: FlashTarget[] = []
    const next = levels.map((row, i) => {
        return row.map((level, j) => {
            if (level === 9) {
                flashes.push([i, j])
                return 0
            }
            return level + 1
        })
    })

    let flashCount = 0
    while (flashes.length > 0) {
        flashCount += flashes.length
        const nextFlashes: FlashTarget[] = []
        for (const [i, j] of flashes) {
            const flashTargets: FlashTarget[] = [
                [i-1, j-1],
                [i-1, j],
                [i-1, j+1],
                [i, j-1],
                [i, j+1],
                [i+1, j-1],
                [i+1, j],
                [i+1, j+1]
            ]
            flashTargets.filter(([i, j]) => (next[i]?.[j] ?? 0) !== 0).forEach(([i, j]) => {
                const level = next[i][j]
                if (level === 9) {
                    nextFlashes.push([i, j])
                    next[i][j] = 0
                } else {
                    next[i][j] += 1
                }
            })
        }
        flashes = nextFlashes
    }
    return {
        nextLevels: next,
        flashCount
    }
}

export async function run(input: Input, options: OptionSelector) {
    let levels = (await input.toArray()).map((row) => row.split('').map((level) => Number.parseInt(level)))
    let steps = options.number(['s', 'steps'], 0)
    let flashes = 0

    if (steps > 0) {
        for (let i = 0; i < steps; i++) {
            const { nextLevels, flashCount } = step(levels)
            levels = nextLevels
            flashes += flashCount
        }
    } else {
        steps = 0
        let done = false
        const flashPoint = levels.reduce((length, row) => length + row.length, 0)
        while (!done) {
            const { nextLevels, flashCount } = step(levels)
            levels = nextLevels
            flashes += flashCount
            done = flashCount === flashPoint
            steps++
        }
    }

    return {
        flashes,
        steps
    }
}