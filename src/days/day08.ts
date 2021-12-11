import { Input, OptionSelector } from "../input.ts"

export async function run(input: Input, _: OptionSelector) {
    let count = 0
    for await (const output of input.map((s) => s.split(' | ')[1]?.split(' ') ?? [])) {
        count += output.filter(o => o.length === 2 || o.length === 3 || o.length === 4 || o.length === 7).length
    }
    return count
}