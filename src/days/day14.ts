import { Input, OptionSelector } from "../input.ts"

type EvolveResult = {[key:string]: number}

export function getPolymerCounts(template: string, pairInsertions: Map<string, string>, steps: number): Map<string, number> {
    const memo: {[key: string]: EvolveResult[]} = {}
    for (const key of pairInsertions.keys()) {
        memo[key] = new Array(steps + 1).fill(null)
    }

    const evolve = (first: string, second: string, depth: number): EvolveResult => {
        const key = first + second
        const baseResult = { [second]: 1 }
        const remainingDepth = steps - depth
        if (!pairInsertions.has(key)) {
            // No polymer pair found in the insertion map, so return the base result.
            return baseResult
        }
        if (memo[key][remainingDepth] !== null) {
            // Already calculated from previous run.
            return memo[key][remainingDepth]
        }

        if (remainingDepth === 0) {
            // We've reached the bottom of the depths, so memoize the base result.
            memo[key][remainingDepth] = baseResult
        } else {
            // Calculate the result of the split, and memoize the result.
            const split = pairInsertions.get(key) as string
            memo[key][remainingDepth] = [
                evolve(first, split, depth + 1),
                evolve(split, second, depth + 1)
            ].reduce((obj, results) => {
                for (const k in results) {
                    obj[k] = (obj[k] ?? 0) + results[k]
                }
                return obj
            }, {})
        }

        return memo[key][remainingDepth]
    }

    const counts = new Map()
    if (template.length > 0) {
        counts.set(template.charAt(0), 1)
    }
    for (let i = 0; i < template.length - 1; i++) {
        const first = template.charAt(i)
        const second = template.charAt(i + 1)
        const results = evolve(first, second, 0)
        for (const key in results) {
            counts.set(key, (counts.get(key) ?? 0) + results[key])
        }
    }
    return counts
}

function getPolymerScore(counts: Map<string, number>): number {
    let min = null
    let max = null
    for (const count of counts.values()) {
        min = Math.min(min ?? count, count)
        max = Math.max(max ?? count, count)
    }
    return max !== null && min !== null ? max - min : 0
}

export async function run(input: Input, options: OptionSelector) {
    const steps = options.number(['s', 'steps'], 10)

    let template = ''
    const pairInsertions: Map<string, string> = new Map()
    for await (const l of input.read()) {
        if (l.substring(2, 6) === ' -> ') {
            pairInsertions.set(l.substring(0, 2), l.charAt(6))
        } else {
            template += l
        }
    }

    const polymerCounts = getPolymerCounts(template, pairInsertions, steps)
    return getPolymerScore(polymerCounts)
}