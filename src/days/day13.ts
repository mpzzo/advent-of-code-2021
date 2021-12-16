import { Input, OptionSelector } from "../input.ts"

interface Point { x: number, y: number }

interface FoldInstruction {
    along: string
    location: number
}

interface Paper {
    dots: Point[]
    foldInstructions: FoldInstruction[]
}

type Surface = boolean[][]

function getSurface(dots: Point[]): Surface {
    const width  = dots.reduce((max, dot) => Math.max(max, dot.x), 0) + 1
    const height = dots.reduce((max, dot) => Math.max(max, dot.y), 0) + 1
    
    const surface = []
    for (let i = 0; i < height; i++) {
        surface.push(new Array(width).fill(false))
    }
    
    for (const {x, y} of dots) {
        surface[y][x] = true
    }
    return surface
}

function foldVertical(location: number, s: Surface): Surface {
    const overhang = Math.max(s.length - (2 * location) - 1, 0)
    const height = overhang + location
    const newSurface = new Array(height)

    for (let i = 0; i < s.length; i++) {
        const y = -1 * Math.abs(i - location) + height
        if (y === height) {
            // skip fold line
            continue
        }
        newSurface[y] = s[i].map((c, x) => c || (newSurface[y]?.[x] ?? false))
    }
    return newSurface
}

function foldHorizontal(location: number, s: Surface): Surface {
    return s.map((row) => {
        const overhang = Math.max(row.length - (2 * location) - 1, 0)
        const width = overhang + location
        const newRow = new Array(width)

        for (let i = 0; i < row.length; i++) {
            const x = -1 * Math.abs(i - location) + width
            if (x === width) {
                // skip fold line
                continue
            }
            newRow[x] = (newRow[x] ?? false) || row[i]
        }
        return newRow
    })
}

export function fold(instruction: FoldInstruction, surface: Surface): Surface {
    const { along, location } = instruction
    if (along === 'y') {
        return foldVertical(location, surface)
    } else if (along === 'x') {
        return foldHorizontal(location, surface)
    } else {
        return surface
    }
}

export async function run(input: Input, options: OptionSelector) {
    const foldCount = options.number(['f', 'folds'], -1)
    const paper = (await input.toArray()).reduce((paper: Paper, line) => {
        if (line.startsWith("fold along ")) {
            paper.foldInstructions.push({
                along: line.charAt(11),
                location: Number.parseInt(line.substring(13))
            })
        } else {
            const d = line.split(",").map(n => Number.parseInt(n))
            if (d.length === 2) {
                const [x, y] = d
                paper.dots.push({ x, y })
            }
        }
        return paper
    }, {
        dots: [],
        foldInstructions: []
    })


    let surface = getSurface(paper.dots)
    for (let i = 0; (foldCount < 0 || i < foldCount) && i < paper.foldInstructions.length; i++) {
        const instruction = paper.foldInstructions[i]
        surface = fold(instruction, surface)
    }

    const dotCount = surface.reduce((count, row) => count + row.filter(dot => dot).length, 0)
    return dotCount
}