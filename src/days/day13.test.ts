import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts"
import { createInputFromString, parseArgs } from "../input.ts"
import { fold, run } from "./day13.ts"

const INPUT = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5
`

function getSurface(s: string[]) {
    return s.map(row => row.split('').map(c => c === '#'))
}

Deno.test("fold horizontal", () => {
    const along = 'x'
    const location = 5
    const surface = getSurface([
        '#.##..#..#.',
        '#...#......',
        '......#...#',
        '#...#......',
        '.#.#..#.###',
        '...........',
        '...........'
    ])
    const expected = getSurface([
        '#####',
        '#...#',
        '#...#',
        '#...#',
        '#####',
        '.....',
        '.....'
    ])
    assertEquals(fold({ along, location }, surface), expected)
})

Deno.test("fold vertical", () => {
    const along = 'y'
    const location = 7
    const surface = getSurface([
        '...#..#..#.',
        '....#......',
        '...........',
        '#..........',
        '...#....#.#',
        '...........',
        '...........',
        '...........',
        '...........',
        '...........',
        '.#....#.##.',
        '....#......',
        '......#...#',
        '#..........',
        '#.#........'
    ])
    const expected = getSurface([
        '#.##..#..#.',
        '#...#......',
        '......#...#',
        '#...#......',
        '.#.#..#.###',
        '...........',
        '...........'
    ])
    const result = fold({ along, location }, surface)
    assertEquals(result, expected)
})

Deno.test("fold vertical with overhang", () => {
    const along = 'y'
    const location = 2
    const surface = getSurface([
        '...#..#..#.',
        '....#......',
        '...........',
        '#..........',
        '...#....#.#',
        '...........',
        '...........',
        '...........',
        '...........',
        '...........',
        '.#....#.##.',
        '....#......',
        '......#...#',
        '#..........',
        '#.#........'
    ])
    const expected = getSurface([
        '#.#........',
        '#..........',
        '......#...#',
        '....#......',
        '.#....#.##.',
        '...........',
        '...........',
        '...........',
        '...........',
        '...........',
        '...#..#.###',
        '#...#......'
    ])
    const result = fold({ along, location }, surface)
    assertEquals(result, expected)
})

Deno.test("run - single fold", async () => {
    const input = createInputFromString(INPUT)
    const options = parseArgs(['-f', '1'])
    const result = await run(input, options)
    assertEquals(result, 17)
})