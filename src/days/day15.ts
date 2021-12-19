import { Input, OptionSelector } from "../input.ts"

export function upscaleMap(map: number[][], scale: number): number[][] {
    if (scale < 1) {
        return []
    } else if (scale === 1) {
        return map
    }

    const result = new Array(map.length * scale)
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < scale; j++) {
            const y = i + (j * map.length)
            result[y] = new Array(map[i].length * scale)
        }
    }
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            for (let k = 0; k < scale; k++) { // y-scale
                for (let l = 0; l < scale; l++) { // x-scale
                    const y = i + (k * map.length)
                    const x = j + (l * map[i].length)
                    const value = ((map[i][j] + k + l - 1) % 9) + 1
                    result[y][x] = value
                }
            }
        }
    }
    return result
}

function getRiskScore(map: number[][]): number {
    if (map.length < 2 || (map[0]?.length ?? 0) < 2) {
        return 0
    }

    const scores: number[][] = new Array(map.length)
    for (let i = 0; i < map.length; i++) {
        scores[i] = new Array(map[i].length).fill(null)
    }

    scores[0][0] = 0
    const queue: [number,number][]= [[0, 1], [1, 0]]
    while (queue.length > 0) {
        const [y, x] = queue.shift() as [number, number]
        const surroundings = [[y-1, x], [y+1, x], [y, x-1], [y, x+1]]
            .filter(([y, x]) => {
                // Filter out surroundings that are out of bounds.
                return y >= 0 && y < scores.length && x >= 0 && x < scores[y].length
            })

        // Calculate risk score based on minimum surrounding risk scores and the value in the map
        const prev = scores[y][x]
        const surroundScore = surroundings.map(([y, x]) => scores[y][x])
            .reduce((min: number|null, score: number|null) => {
                if (min === null) {
                    return score
                } else if (score === null) {
                    return min
                } else {
                    return Math.min(score, min)
                }
            }, null) ?? 0
        const score = map[y][x] + surroundScore

        if (prev === null || score < prev) {
            // If the calculated score is new and lower than the previous score, set it in the scores.
            scores[y][x] = score
            for (const [yNext, xNext] of surroundings) {
                const next = scores[yNext][xNext]
                const nextScore = score + map[yNext][xNext]
                if (next === null || next > nextScore) {
                    // Add it to the queue if the surrounding element hasn't been calcualted, or if
                    // recalculating that point will result in a lower score.
                    queue.push([yNext, xNext])
                }
            }
        }
    }

    const resultY = scores.length - 1
    const resultX = scores[resultY].length - 1
    return scores[resultY][resultX]
}

export async function run(input: Input, options: OptionSelector) {
    const scale = options.number(['s', 'scale'], 1)
    const riskMap = upscaleMap(
        (await input.toArray()).map((row) => row.split('').map(n => Number.parseInt(n))),
        scale
    )

    const lowestRiskScore = getRiskScore(riskMap)
    return lowestRiskScore
}