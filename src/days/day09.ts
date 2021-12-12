import { Input, OptionSelector } from "../input.ts"
interface RunResult {
    riskLevel: number,
    largestBasins: number
}

function calculateRiskLevel(heightMap: number[][]): number {
    let riskLevel = 0
    for (let i = 0; i < heightMap.length; i++) {
        for (let j = 0; j < heightMap[i].length; j++) {
            const adjacentHeight = Math.min(
                heightMap[i][j - 1] ?? 10,
                heightMap[i][j + 1] ?? 10,
                heightMap[i - 1]?.[j] ?? 10,
                heightMap[i + 1]?.[j] ?? 10
            )
            const height = heightMap[i][j]
            if (adjacentHeight > height) {
                riskLevel += height + 1
            }
        }
    }
    return riskLevel
}

function calculateLargestBasins(heightMap: number[][]): number {
    const visited = heightMap.map(row => row.map(value => value === 9))
    const visitBasin = (x: number, y: number): number => {
        visited[y][x] = true
        let score = 1
        score += (visited[y][x - 1]   ?? true) ? 0 : visitBasin(x - 1, y)
        score += (visited[y][x + 1]   ?? true) ? 0 : visitBasin(x + 1, y)
        score += (visited[y - 1]?.[x] ?? true) ? 0 : visitBasin(x, y - 1)
        score += (visited[y + 1]?.[x] ?? true) ? 0 : visitBasin(x, y + 1)
        return score
    }

    const basinSizes: number[] = []
    for (let i = 0; i < visited.length; i++) {
        for (let j = 0; j < visited[i].length; j++) {
            if (!visited[i][j]) {
                const size = visitBasin(j, i)
                basinSizes.push(size)
            }
        }
    }

    let largestBasins = 1
    basinSizes.sort((a, b) => b - a)
    console.log(basinSizes)
    for (let i = 0; i < 3 && i < basinSizes.length; i++) {
        largestBasins *= basinSizes[i]
    }

    return basinSizes.length > 0 ? largestBasins : 0
}

export async function run(input: Input, _: OptionSelector) {
    const heightMap = (await input.toArray()).map((row) => row.split('').map(n => Number.parseInt(n)))
    const result: RunResult = {
        riskLevel: calculateRiskLevel(heightMap),
        largestBasins: calculateLargestBasins(heightMap)
    }
    return result
}