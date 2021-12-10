import { Input, OptionSelector } from "../input.ts"

type FuelCalculator = (distance: number) => number

const generalEngineFuelCalculator: FuelCalculator = (d) => d
const crabEngineFuelCalculator: FuelCalculator = (d) => 0.5 * d * (d + 1)

export async function run(input: Input, options: OptionSelector) {
    const isCrabEngine = options.boolean(['c', 'crabEngine'], false)
    const positions = (await input.toArray()).reduce((positions, s) => {
        return positions.concat(s.split(",").map(n => Number.parseInt(n)))
    }, new Array<number>())

    const calculator = isCrabEngine ? crabEngineFuelCalculator : generalEngineFuelCalculator
    const positionMax = positions.reduce((max, n) => Math.max(max, n), 0)
    const positionMin = positions.reduce((min, n) => Math.min(min, n), positionMax)

    let minFuel = null
    for (let i = positionMin; i <= positionMax; i++) {
        const value = positions.reduce((fuel, position) => {
            const distance = Math.abs(position - i)
            return fuel + calculator(distance)
        }, 0)
        minFuel = minFuel !== null ? Math.min(minFuel, value) : value
    }

    return minFuel
}