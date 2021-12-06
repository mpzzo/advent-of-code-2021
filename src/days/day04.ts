import { readLines } from "https://deno.land/std@0.116.0/io/mod.ts"

interface BingoRun {
    moves: number[],
    boards: number[][][]
}

async function parseInput(input: Deno.Reader): Promise<BingoRun> {
    const iter = readLines(input)
    let curr = await iter.next()

    let moves: number[] = []
    while (!curr.done && curr.value !== '') {
        moves = moves.concat(curr.value.split(',').map(number => Number.parseInt(number)))
        curr = await iter.next()
    }

    const boards: number[][][] = []
    while (!curr.done) {
        if (curr.value === '') {
            boards.push([])
        } else {
            boards[boards.length - 1].push(curr.value
                .split(' ')
                .filter(num => num !== '')
                .map(num => Number.parseInt(num))
            )
        }
        curr = await iter.next()
    }

    while (boards[boards.length - 1].length === 0) {
        boards.pop()
    }

    return { moves, boards }
}

class BingoCard {
    numbers: number[][]
    marked: boolean[][]
    lookup: Map<number, [number, number]>

    constructor(numbers: number[][]) {
        this.numbers = numbers
        this.marked = numbers.map((row) => new Array(row.length).fill(false))
        this.lookup = numbers.reduce((map, row, y) => {
            row.forEach((num, x) => map.set(num, [y, x]))
            return map
        }, new Map<number, [number, number]>())
    }

    find(num: number) {
        return this.lookup.get(num)
    }

    mark(y: number, x: number) {
        this.marked[y][x] = true
    }

    checkWin(y: number, x: number) {
        return this.marked.every((row) => row[x] ?? false)
            || (this.marked[y]?.every((mark) => mark) ?? false)
    }

    getFinalScore(lastCalled: number) {
        return lastCalled * this.numbers.reduce((boardScore, row, y) => {
            return boardScore + row.reduce((rowScore, num, x) => {
                return rowScore + (this.marked[y][x] ? 0 : num)
            }, 0)
        }, 0)
    }
}

interface SimulationResult {
    winner: BingoCard|null
    lastCalled: number
}

class BingoSimulator {
    constructor (private readonly run: BingoRun) {}

    simulate(): SimulationResult {
        const cards = this.run.boards.map((board) => new BingoCard(board))
        for (const num of this.run.moves) {
            for (const card of cards) {
                const position = card.find(num)
                if (!position) {
                    continue
                }

                const [y, x] = position
                card.mark(y, x)
                if (card.checkWin(y, x)) {
                    return {
                        winner: card,
                        lastCalled: num
                    }
                }
            }
        }
        return {
            winner: null,
            lastCalled: this.run.moves[this.run.moves.length - 1]
        }
    }
}


export async function run(input: Deno.Reader) {
    const bingo = await parseInput(input)
    const simulation = new BingoSimulator(bingo).simulate()
    const result = simulation.winner ? simulation.winner.getFinalScore(simulation.lastCalled) : -1
    return result
}