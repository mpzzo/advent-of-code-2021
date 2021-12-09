import { Input, OptionSelector } from "../input.ts"

interface Coordinates { x: number, y: number }
interface LineSegment { start: Coordinates, end: Coordinates }

function isDiagonal(s: LineSegment) {
    return Math.abs(s.end.x - s.start.x) === Math.abs(s.end.y - s.start.y)
}

function parseSegments(s: string): LineSegment {
    const [ start, end ] = s.split(' -> ').map((c: string): Coordinates => {
        const [x, y] = c.split(',').map(num => Number.parseInt(num))
        return { x, y }
    })
    return { start, end }
}

function getLineCoordinates(s: LineSegment): Coordinates[] {
    if (s.start.x !== s.end.x && s.start.y !== s.end.y && !isDiagonal(s)) {
        return []
    }
    
    const line: Coordinates[] = []
    const vector = {
        x: Math.sign(s.end.x - s.start.x),
        y: Math.sign(s.end.y - s.start.y)
    }

    let done = false
    let current = s.start
    while (!done) {
        line.push(current)
        if (current.x === s.end.x && current.y === s.end.y) {
            done = true
        } else {
            current = { x: current.x + vector.x, y: current.y + vector.y }
        }
    }

    return line
}

export async function run(input: Input, options: OptionSelector) {
    const includeDiagonals = options.boolean(['d', 'includeDiagonals'], false)
    const segments = (await input.toArray())
        .map((s: string) => parseSegments(s))
        .filter((s: LineSegment) => s.start.x === s.end.x 
            || s.start.y === s.end.y
            || (includeDiagonals && isDiagonal(s))
        )

    const width  = segments.reduce((length, s) => Math.max(length, s.start.x, s.end.x), 0) + 1
    const height = segments.reduce((length, s) => Math.max(length, s.start.y, s.end.y), 0) + 1

    const diagram = new Array<number[]>(height)
    for (let y = 0; y < diagram.length; y++) {
        diagram[y] = new Array<number>(width).fill(0)
    }

    for (const segment of segments) {
        const coordinates = getLineCoordinates(segment)
        coordinates.forEach(({x, y}) => diagram[y][x] += 1) 
    }

    return diagram.reduce((count, row) => count + row.filter(c => c > 1).length, 0)
}