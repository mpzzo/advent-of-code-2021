import { Input, OptionSelector } from "../input.ts"
interface Coordinates { x: number, y: number }
interface LineSegment { start: Coordinates, end: Coordinates }

function map(s: string): LineSegment {
    const [ start, end ] = s.split(' -> ').map((c: string): Coordinates => {
        const [x, y] = c.split(',').map(num => Number.parseInt(num))
        return { x, y }
    })
    return { start, end }
}

function getLineCoordinates(segment: LineSegment): Coordinates[] {
    const line = []
    if (segment.start.x === segment.end.x) {
        const x = segment.start.x
        const start = Math.min(segment.start.y, segment.end.y)
        const end   = Math.max(segment.start.y, segment.end.y)
        for (let y = start; y <= end; y++) {
            line.push({x, y})
        }
    } else if (segment.start.y === segment.end.y) {
        const y = segment.start.y
        const start = Math.min(segment.start.x, segment.end.x)
        const end   = Math.max(segment.start.x, segment.end.x)
        for (let x = start; x <= end; x++) {
            line.push({x, y})
        }
    }
    return line
}

export async function run(input: Input, _: OptionSelector) {
    const segments = (await input.toArray())
        .map((s: string) => map(s))
        .filter((s: LineSegment) => s.start.x === s.end.x || s.start.y === s.end.y)

    const width  = segments.reduce((length, segment) => Math.max(length, segment.start.x, segment.end.x), 0) + 1
    const height = segments.reduce((length, segment) => Math.max(length, segment.start.y, segment.end.y), 0) + 1

    const diagram = new Array<number[]>(height)
    for (let y = 0; y < diagram.length; y++) {
        diagram[y] = new Array<number>(width).fill(0)
    }

    for (const segment of segments) {
        const coordinates = getLineCoordinates(segment)
        console.log(segment, coordinates)
        coordinates.forEach(({x, y}) => diagram[y][x] += 1) 
    }

    return diagram.reduce((count, row) => count + row.filter(c => c > 1).length, 0)
}