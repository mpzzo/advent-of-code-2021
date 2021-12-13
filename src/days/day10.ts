import { Input, OptionSelector } from "../input.ts"

const brackets: {[key: string]: string} = {
    '{': '}',
    '[': ']',
    '(': ')',
    '<': '>'
}

const illegalCharacterPoints: {[key: string]: number} = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137
}

const autoCompletePoints: {[key: string]: number} = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4
}


const openBrackets = Object.keys(brackets)

function getSyntaxErrorScore(s: string): number {
    const stack = []
    for (let i = 0; i < s.length; i++) {
        const bracket = s.charAt(i)
        if (openBrackets.findIndex(c => c === bracket) > -1) {
            stack.push(bracket)
        } else {
            const open = stack.pop() ?? ''
            const closed = brackets[open] ?? ''
            if (closed !== bracket) {
                const score = illegalCharacterPoints[bracket] ?? 0
                return score
            }
        }
    }

    // Non-corrupted lines have a score of 0
    return 0
}

function getAutoCompleteScore(s: string): number {
    const stack = []
    for (let i = 0; i < s.length; i++) {
        const bracket = s.charAt(i)
        if (openBrackets.findIndex(c => c === bracket) > -1) {
            stack.push(bracket)
        } else {
            const open = stack.pop() ?? ''
            const closed = brackets[open] ?? ''
            if (closed !== bracket) {
                // Corrupted lines have a score of 0.
                return 0
            }
        }
    }

    let score = 0
    while (stack.length > 0) {
        const open = stack.pop() as string
        const closed = brackets[open]
        score = (5 * score) + autoCompletePoints[closed]
    }
    return score
}

export async function run(input: Input, _: OptionSelector) {
    const syntaxErrorScores: number[] = []
    const autoCompleteScores: number[] = []
    for await (const s of input.read()) {
        const syntaxErrorScore = getSyntaxErrorScore(s)
        const autoCompleteScore = getAutoCompleteScore(s)
        if (syntaxErrorScore > 0) {
            syntaxErrorScores.push(syntaxErrorScore)
        }
        if (autoCompleteScore > 0) {
            autoCompleteScores.push(autoCompleteScore)
        }
    }

    autoCompleteScores.sort((a, b) => a - b)
    return {
        totalSyntaxErrorScore: syntaxErrorScores.reduce((sum, score) => sum + score),
        autoCompleteScore: autoCompleteScores[Math.floor(autoCompleteScores.length / 2)]
    }
}