import { Input, OptionSelector } from "../input.ts"

type SnailfishValue = SnailfishNumber|number
enum SnailfishOrdinal { LEFT = 0, RIGHT = 1 }

export class SnailfishNumber {
    constructor(private left: SnailfishValue, private right: SnailfishValue) {}

    getMagnitude(): number {
        const left = 3 * (this.left instanceof SnailfishNumber ? this.left.getMagnitude() : this.left)
        const right = 2 * (this.right instanceof SnailfishNumber ? this.right.getMagnitude() : this.right)
        return left + right
    }

    reduce() {
        let reduce = true
        while (reduce) {
            // console.debug('reducing', this.toString())
            reduce = this.explode() || this.split()
        }
    }

    toString(): string {
        return `[${[this.left, this.right].map((value) => value.toString()).join()}]`
    }

    clone(): SnailfishNumber {
        return new SnailfishNumber(
            this.left instanceof SnailfishNumber ? this.left.clone() : this.left,
            this.right instanceof SnailfishNumber ? this.right.clone() : this.right
        )
    }

    private get(key: SnailfishOrdinal[]): SnailfishValue|undefined {
        if (key.length === 0) {
            return this
        }
        const [o, ...rest] = key
        const value = o === SnailfishOrdinal.LEFT ? this.left : this.right
        if (rest.length === 0) {
            return value
        } else if (value instanceof SnailfishNumber) {
            return value.get(rest)
        } else {
            return undefined
        }
    }

    private set(key: SnailfishOrdinal[], value: SnailfishValue) {
        const o = key[key.length - 1]
        const parent = this.get(key.slice(0, -1))
        if (parent === undefined || !(parent instanceof SnailfishNumber)) {
            throw new Error(`Key '${key.join()}' is undefined for snailfish number ${this.toString()}`)
        } else if (o === SnailfishOrdinal.LEFT) {
            parent.left = value
        } else {
            parent.right = value
        }
    }

    private walk(): [SnailfishOrdinal[], number][] {
        const recurse = (num: SnailfishValue, base: SnailfishOrdinal[]): [SnailfishOrdinal[], number][] => {
            if (typeof num === "number") {
                return [[base, num]]
            }
            return new Array<[SnailfishOrdinal[], number]>().concat(
                recurse(num.left, [...base, SnailfishOrdinal.LEFT]),
                recurse(num.right, [...base, SnailfishOrdinal.RIGHT])
            )
        }
        return recurse(this, [])
    }

    private explode(): boolean {
        const entries = this.walk()
        const index = entries.findIndex(([key, _]) => key.length > 4)
        const leftBlast = entries[index - 1] ?? null
        const leftEntry = entries[index] ?? null
        const rightEntry = entries[index + 1] ?? null
        const rightBlast = entries[index + 2] ?? null
        if ([leftEntry, rightEntry].some(entry => entry === null)) {
            return false
        }

        const explodeKey = leftEntry[0].slice(0, -1)
        // console.debug('explode action', explodeKey, [leftEntry, rightEntry].map((e) => e[1]))
        this.set(explodeKey, 0)
        if (leftBlast !== null) {
            const [key, value] = leftBlast
            this.set(key, value + leftEntry[1])
        }
        if (rightBlast !== null) {
            const [key, value] = rightBlast
            this.set(key, value + rightEntry[1])
        }
        return true
    }

    private split(): boolean {
        const entries = this.walk()
        const index = entries.findIndex(([_, value]) => value > 9)
        if (index < 0) {
            return false
        }
    
        const [key, value] = entries[index]
        const left = Math.floor(value / 2)
        const right = value - left
        // console.debug('split action', key, value)
        this.set(key, new SnailfishNumber(left, right))
        return true
    }

    static add(...nums: SnailfishNumber[]): SnailfishNumber|null {
        let result = null
        for (const num of nums) {
            const right = num.clone()
            if (result === null) {
                result = right
                continue
            }
            const left = result.clone()
            result = new SnailfishNumber(left, right)
            result.reduce()
        }
        return result
    }

    static fromString(s: string): SnailfishNumber {
        const extractPair = (start: number) => {
            let end = start
            let brackets = 0
            do {
                const c = s.charAt(end)
                if (c === '[') {
                    brackets += 1
                } else if (c === ']') {
                    brackets -= 1
                }
                end++
            } while (brackets > 0)
            return s.slice(start, end)
        }
        const extractNumber = (start: number) => {
            let end = start
            while (s[end] >= '0' && s[end] <= '9') {
                end++
            }
            return s.slice(start, end)
        }

        let left, right, i = 1
        if (s.charAt(i) === '[') {
            const slice = extractPair(i)
            left = SnailfishNumber.fromString(slice)
            i += slice.length
        } else {
            const slice = extractNumber(i)
            left = Number.parseInt(slice)
            i += slice.length
        }
        i++
        if (s.charAt(i) === '[') {
            right = SnailfishNumber.fromString(extractPair(i))
        } else {
            right = Number.parseInt(extractNumber(i))
        }
        return new this(left, right)
    }
}

function getFinalSum(nums: SnailfishNumber[]): number {
    return SnailfishNumber.add(...nums)?.getMagnitude() ?? 0
}

function getLargestTwoSum(nums: SnailfishNumber[]): number {
    let max = 0
    for (const n1 of nums) {
        for (const n2 of nums) {
            max = Math.max(SnailfishNumber.add(n1, n2)?.getMagnitude() ?? 0, max)
        }
    }
    return max
}

export async function run(input: Input, _options: OptionSelector) {
    const nums = (await input.toArray()).map(s => SnailfishNumber.fromString(s))
    return {
        finalSum: getFinalSum(nums),
        largestTwoSum: getLargestTwoSum(nums)
    }
}