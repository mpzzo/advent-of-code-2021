import { Input, OptionSelector } from "../input.ts"

const FISH_TIMER_SPAWN = 8
const FISH_TIMER_RESET = 6

function simulate(initialFish: number[], days: number): number[] {
    let counts = initialFish.filter(f => f <= FISH_TIMER_SPAWN).reduce((count, f) => {
        count[f] += 1
        return count
    }, new Array<number>(FISH_TIMER_SPAWN + 1).fill(0))

    for (let i = 0; i < days; i++) {
        const next = new Array<number>(counts.length).fill(0)

        // Handle aging fish
        for (let j = 1; j < counts.length; j++) {
            next[j - 1] += counts[j]
        }

        // Handle fish creation
        next[FISH_TIMER_RESET] += counts[0]
        next[FISH_TIMER_SPAWN] += counts[0]
        counts = next
    }
    return counts
}

export async function run(input: Input, options: OptionSelector) {
    const days = options.number(['d', 'days'], 80)

    const initialFish = (await input.toArray()).reduce((fish, s) => {
        const newFish = s.split(',').map(f => Number.parseInt(f))
        return fish.concat(newFish)
    }, new Array<number>())

    return simulate(initialFish, days).reduce((sum, count) => sum + count, 0)
}