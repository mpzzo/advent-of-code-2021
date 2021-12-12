import { Input, OptionSelector } from "../input.ts"

export async function run(input: Input, _: OptionSelector) {
    let riskLevels = 0
    const heightMap = (await input.toArray()).map((row) => row.split('').map(n => Number.parseInt(n)))
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
                riskLevels += height + 1
            }
        }
    }
    return riskLevels
}