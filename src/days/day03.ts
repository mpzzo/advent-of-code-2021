import { readLines } from "https://deno.land/std@0.116.0/io/mod.ts"

export async function getPowerConsumption(input: AsyncIterable<string>) {
    const bitCount: [number, number][] = []
    for await (const bits of input) {
        bits.split('').forEach((bit, i) => {
            const counts = bitCount[i] ?? [0, 0]
            if (bit === '0') {
                counts[0] += 1
            } else if (bit === '1') {
                counts[1] += 1
            }
            bitCount[i] = counts
        })
    }

    const gamma   = bitCount.map((b) => b[0] > b[1] ? '0' : '1').join('')
    const epsilon = bitCount.map((b) => b[0] < b[1] ? '0' : '1').join('')
    return Number.parseInt(gamma, 2) * Number.parseInt(epsilon, 2)
}

type RatingBucket = [string[], string[]]
type RatingBucketFilter = (b: RatingBucket) => string[]

function getRatingFromValues(values: string[], filter: RatingBucketFilter): string {
    let remainder = values
    for (let i = 0; remainder.length > 1 && i < remainder[0].length; i++) {
        const buckets = remainder.reduce((carry, value) => {
            if (value[i] === '0') {
                carry[0].push(value)
            } else {
                carry[1].push(value)
            }
            return carry
        }, [[], []] as RatingBucket)

        remainder = filter(buckets)
    }
    return remainder[0]
}

export async function getLifeSupportRating(input: AsyncIterable<string>) {
    const values: string[] = []
    for await (const value of input) {
        values.push(value)
    }
    const oxygenRating   = getRatingFromValues(values, (b) => b[0].length <= b[1].length ? b[1] : b[0])
    const scrubberRating = getRatingFromValues(values, (b) => b[0].length >  b[1].length ? b[1] : b[0])
    return Number.parseInt(oxygenRating, 2) * Number.parseInt(scrubberRating, 2)
}

async function* inputGenerator(input: Deno.Reader) {
    for await (const l of readLines(input)) {
        yield l
    }
}

export async function run(input: Deno.Reader) {
    const course = inputGenerator(input)
    // Part One:
    // const result = await getPowerConsumption(course)
    // Part Two:
    const result = await getLifeSupportRating(course)
    console.log(result)
}