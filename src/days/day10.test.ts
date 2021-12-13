import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts"
import { createInputFromString, parseArgs } from "../input.ts"
import { run } from "./day10.ts"

const INPUT = `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]
`

Deno.test("run", async () => {
    const input = createInputFromString(INPUT)
    const options = parseArgs()
    const { totalSyntaxErrorScore, autoCompleteScore } = await run(input, options)
    assertEquals(totalSyntaxErrorScore, 26397)
    assertEquals(autoCompleteScore, 288957)
})