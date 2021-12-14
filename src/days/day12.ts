import { Input, OptionSelector } from "../input.ts"

const A = 'a'.charCodeAt(0)
const Z = 'z'.charCodeAt(0)
const START = 'start'
const END = 'end'

type CaveMap = Map<string, string[]>

enum CaveType {
    SMALL_CAVE,
    LARGE_CAVE
}

class CaveOccupancy {
    constructor(
        private readonly type: CaveType,
        private readonly visitLimit: number, 
        private visits: number = 0
    ) {}

    canVisit() {
        return this.type === CaveType.LARGE_CAVE 
            || this.visits < this.visitLimit
    }

    incrementVisits() {
        this.visits++
    }

    decrementVisits() {
        this.visits--
    }
}

class VisitTracker {

    constructor(
        private readonly start: string,
        private readonly end: string,
        private readonly occupancy: Map<string, CaveOccupancy>,
        private readonly path: string[] = []
    ) {}

    canVisit(cave: string): boolean {
        return !(this.path.length === 0 && cave !== this.start)
            && !this.hasReachedEnd()
            && (this.occupancy.get(cave)?.canVisit() ?? false)
    }

    visit(cave: string) {
        if (!this.canVisit(cave)) {
            throw new Error(`cannot visit cave: ${cave}`)
        }
        this.occupancy.get(cave)?.incrementVisits()
        this.path.push(cave)
    }

    backtrack() {
        if (this.path.length <= 1) {
            throw new Error('cannot backtrack from start')
        }
        const cave = this.path.pop() as string
        this.occupancy.get(cave)?.decrementVisits()
    }

    getPath() {
        return this.path
    }
    
    hasReachedEnd() {
        return this.path[this.path.length - 1] === this.end
    }
}

function isSmallCave(cave: string) {
    const code = cave.charCodeAt(0)
    return code >= A && code <= Z
}

function countPaths(caves: CaveMap, revisitableCaveVisits: number): number {
    const paths: Set<string> = new Set()
    const walk = (current: string, tracker: VisitTracker) => {
        tracker.visit(current)
        if (tracker.hasReachedEnd()) {
            paths.add(tracker.getPath().join(','))
            return
        }

        const nextCaves = caves.get(current) ?? []
        for (const cave of nextCaves) {
            if (!tracker.canVisit(cave)) {
                continue
            }
            walk(cave, tracker)
            tracker.backtrack()
        }
    }

    const smallCaves = Array.from(caves.keys()).filter(c => c !== START && c !== END)
    for (const revisitableCave of smallCaves) {
        const occupancyEntries: [string, CaveOccupancy][] = Array.from(caves.keys()).map((c) => {
            const type = isSmallCave(c) ? CaveType.SMALL_CAVE : CaveType.LARGE_CAVE
            const visitLimit = c === revisitableCave ? revisitableCaveVisits : 1
            return [c, new CaveOccupancy(type, visitLimit)]
        })
        const tracker = new VisitTracker(START, END, new Map(occupancyEntries))
        walk(START, tracker)
    }

    return paths.size
}

export async function run(input: Input, options: OptionSelector) {
    const revisitableCaveVisits = options.number(['v', 'visits'], 1)
    const caves = new Map()
    for await (const [ cave, connection ] of input.map((s) => s.split('-'))) {
        let connected: string[]

        connected = caves.get(cave) ?? []
        connected.push(connection)
        caves.set(cave, connected)

        connected = caves.get(connection) ?? []
        connected.push(cave)
        caves.set(connection, connected)
    }

    const count = countPaths(caves, revisitableCaveVisits)
    return count
}