import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts"
import { run, SnailfishNumber } from "./day18.ts"
import { createInputFromString, parseArgs } from "../input.ts"

const INPUT = `\
[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]
`

Deno.test("SnailfishNumber.reduce", () => {
    const examples = [
        ["[[[[[9,8],1],2],3],4]", "[[[[0,9],2],3],4]"],
        ["[7,[6,[5,[4,[3,2]]]]]", "[7,[6,[5,[7,0]]]]"],
        ["[[6,[5,[4,[3,2]]]],1]", "[[6,[5,[7,0]]],3]"],
        ["[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]", "[[3,[2,[8,0]]],[9,[5,[7,0]]]]"]
    ]
    for (const [input, expected] of examples) {
        const number = SnailfishNumber.fromString(input)
        number.reduce()
        assertEquals(number.toString(), expected)
    }
})

Deno.test("SnailfishNumber.add", () => {
    const num = SnailfishNumber.add(
        SnailfishNumber.fromString("[[[[4,3],4],4],[7,[[8,4],9]]]"),
        new SnailfishNumber(1, 1)
    )
    assertEquals(num?.toString(), "[[[[0,7],4],[[7,8],[6,0]]],[8,1]]")
})

Deno.test("SnailfishNumber.add - multiple numbers", () => {
    const nums = [
        new SnailfishNumber(1, 1),
        new SnailfishNumber(2, 2),
        new SnailfishNumber(3, 3),
        new SnailfishNumber(4, 4),
        new SnailfishNumber(5, 5),
        new SnailfishNumber(6, 6)
    ]
    assertEquals(SnailfishNumber.add(...nums)?.toString(), "[[[[5,0],[7,4]],[5,5]],[6,6]]")
})

Deno.test("SnailfishNumber.add - complex example", () => {
    const nums = [
        SnailfishNumber.fromString("[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]"),
        SnailfishNumber.fromString("[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]"),
        SnailfishNumber.fromString("[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]"),
        SnailfishNumber.fromString("[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]"),
        SnailfishNumber.fromString("[7,[5,[[3,8],[1,4]]]]"),
        SnailfishNumber.fromString("[[2,[2,2]],[8,[8,1]]]"),
        SnailfishNumber.fromString("[2,9]"),
        SnailfishNumber.fromString("[1,[[[9,3],9],[[9,0],[0,7]]]]"),
        SnailfishNumber.fromString("[[[5,[7,4]],7],1]"),
        SnailfishNumber.fromString("[[[[4,2],2],6],[8,7]]")        
    ]
    assertEquals(SnailfishNumber.add(...nums)?.toString(), "[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]")
})

Deno.test("SnailfishNumber.getMagnitude", () => {
    assertEquals(SnailfishNumber.fromString("[[1,2],[[3,4],5]]").getMagnitude(), 143)
    assertEquals(SnailfishNumber.fromString("[[[[0,7],4],[[7,8],[6,0]]],[8,1]]").getMagnitude(), 1384)
    assertEquals(SnailfishNumber.fromString("[[[[1,1],[2,2]],[3,3]],[4,4]]").getMagnitude(), 445)
    assertEquals(SnailfishNumber.fromString("[[[[3,0],[5,3]],[4,4]],[5,5]]").getMagnitude(), 791)
    assertEquals(SnailfishNumber.fromString("[[[[5,0],[7,4]],[5,5]],[6,6]]").getMagnitude(), 1137)
    assertEquals(SnailfishNumber.fromString("[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]").getMagnitude(), 3488)
})
Deno.test("SnailfishNumber.fromString", () => {
    const examples = [
        "[1,2]",
        "[[1,2],3]",
        "[9,[8,7]]",
        "[[1,9],[8,5]]",
        "[[[[1,2],[3,4]],[[5,6],[7,8]]],9]",
        "[[[9,[3,8]],[[0,9],6]],[[[3,7],[4,9]],3]]",
        "[[[[1,3],[5,3]],[[1,3],[8,7]]],[[[4,9],[6,9]],[[8,2],[7,3]]]]"
    ]
    for (const s of examples) {
        assertEquals(SnailfishNumber.fromString(s).toString(), s)
    }
})

Deno.test("run", async () => {
    const input = createInputFromString(INPUT)
    const options = parseArgs()
    const { finalSum, largestTwoSum } = await run(input, options)
    assertEquals(finalSum, 4140)
    assertEquals(largestTwoSum, 3993)
})