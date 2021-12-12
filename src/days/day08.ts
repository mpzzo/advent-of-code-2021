import { Input, OptionSelector } from "../input.ts"

const A = 'a'.charCodeAt(0)

interface InputLine {
    signalPattern: string[]
    outputValues: string[]
}

interface RunResult {
    count1478: number,
    sum: number
}

export function lightCode(s: string): number {
    let code = 0
    for (let i = 0; i < s.length; i++) {
        code = code | (1 << (s.charCodeAt(i) - A))
    }
    return code
}

export function getLightConfiguration(values: string[]): Map<number, number> {
    const lengths = values.reduce((map, c) => {
        const list = map.get(c.length) ?? []
        list.push(lightCode(c))
        map.set(c.length, list)
        return map
    }, new Map<number, number[]>())

    const config: {[index: number]: number} = {}
    config[8] = lengths.get(7)?.[0] ?? 0
    config[4] = lengths.get(4)?.[0] ?? 0
    config[7] = lengths.get(3)?.[0] ?? 0
    config[1] = lengths.get(2)?.[0] ?? 0
    config[3] = lengths.get(5)?.find(code => (code & config[1]) === config[1]) ?? 0
    config[9] = config[3] | config[4]
    config[6] = lengths.get(6)?.find(code => {
        const check = config[9] & ~config[1]
        return code !== config[9] && (code & check) === check
    }) ?? 0
    config[5] = config[9] & config[6]
    config[0] = lengths.get(6)?.find(code => code !== config[9] && code !== config[6]) ?? 0
    config[2] = lengths.get(5)?.find(code => code !== config[3] && code !== config[5]) ?? 0

    const result = new Map()
    for (const k in config) {
        result.set(config[k], Number.parseInt(k))
    }
    return result
}

function mapInput(s: string): InputLine {
    const [ sp, ov ] = s.split(' | ')
    return {
        signalPattern: sp.split(' '),
        outputValues: ov.split(' ')
    }
}

function get1478Occurrences(line: InputLine): number {
    return line.outputValues.filter(o => {
        return o.length === 2 
            || o.length === 3
            || o.length === 4
            || o.length === 7
    }).length
}

function getOutputValue(line: InputLine): number {
    const config = getLightConfiguration(line.signalPattern)
    if (config.size !== line.signalPattern.length) {
        console.warn(
            'Signal pattern is missing from light configuration.',
            line.signalPattern.map(l => [l, lightCode(l)]),
            config
        )
    }

    const number = line.outputValues.reduce((carry, value, index, values) => {
        const code = lightCode(value)
        if (!config.has(code)) {
            throw new Error(`Lightcode not found in configuration: ${value}`)
        }
        const n = config.get(code) as number
        const exp = values.length - (index + 1)
        return carry + (n * Math.pow(10, exp))
    }, 0)

    return number
}

export async function run(input: Input, _: OptionSelector) {
    const result: RunResult = { count1478: 0, sum: 0 }
    for await (const line of input.map(mapInput)) {
        result.count1478 += get1478Occurrences(line)
        result.sum += getOutputValue(line)
    }
    return result
}