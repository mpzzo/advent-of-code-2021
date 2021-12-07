import { Buffer, readLines } from "https://deno.land/std@0.116.0/io/mod.ts"
import { Args, parse } from "https://deno.land/std@0.116.0/flags/mod.ts"

  // deno-lint-ignore no-explicit-any
type OptionTransform<T> = (a: any) => T

export class Input {
    constructor(
        private readonly reader: Deno.Reader
    ) {}

    read() {
        return this.map((s: string) => s)
    }

    async* map<T>(mapper: (s: string) => T) {
        for await (const l of this.readLines()) {
            yield mapper(l)
        }
    }

    readLines() {
        return readLines(this.reader)
    }
}

export class OptionSelector {
    constructor(private readonly args: Args) {}

    string(keys: string[], defaultValue: string) {
        return this.select(keys, defaultValue, (a) => new String(a))
    }

    number(keys: string[], defaultValue: number) {
        return this.select(keys, defaultValue, (a) => Number.parseInt(a))
    }
    
    boolean(keys: string[], defaultValue: boolean) {
        return this.select(keys, defaultValue, (a) => new Boolean(a))
    }

    select<T>(keys: string[], defaultValue: T, transform: OptionTransform<T>): T {
        for (const key of keys) {
            const value = this.args[key] ?? null
            if (value !== null) {
                return transform(value)
            }
        }
        return defaultValue
    }
}

export function createInputFromString(s: string): Input {
    const reader = new Buffer(new TextEncoder().encode(s))
    return new Input(reader)
}

export function parseArgs(args: string[]) {
    const a = parse(args)
    return new OptionSelector(a)
}