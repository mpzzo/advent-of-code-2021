import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts"
import { createInputFromString, parseArgs } from "../input.ts"
import { run } from "./day12.ts"

const INPUT = `start-A
start-b
A-c
A-b
b-d
A-end
b-end
`

const INPUT_LARGER = `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc
`

const INPUT_EVEN_LARGER = `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW
`

Deno.test("run - cave walk (example input)", async () => {
    const input = createInputFromString(INPUT)
    const options = parseArgs()
    const result = await run(input, options)
    assertEquals(result, 10)
})

Deno.test("run - cave walk, visit 2 (example input)", async () => {
    const input = createInputFromString(INPUT)
    const options = parseArgs(['-v', '2'])
    const result = await run(input, options)
    assertEquals(result, 36)
})

Deno.test("run - cave walk (larger example input)", async () => {
    const input = createInputFromString(INPUT_LARGER)
    const options = parseArgs()
    const result = await run(input, options)
    assertEquals(result, 19)
})

Deno.test("run - cave walk, visit 2 (larger example input)", async () => {
    const input = createInputFromString(INPUT_LARGER)
    const options = parseArgs(['-v', '2'])
    const result = await run(input, options)
    assertEquals(result, 103)
})

Deno.test("run - cave walk (even larger example input)", async () => {
    const input = createInputFromString(INPUT_EVEN_LARGER)
    const options = parseArgs()
    const result = await run(input, options)
    assertEquals(result, 226)
})

Deno.test("run - cave walk, visit 2 (even larger example input)", async () => {
    const input = createInputFromString(INPUT_EVEN_LARGER)
    const options = parseArgs(['-v', '2'])
    const result = await run(input, options)
    assertEquals(result, 3509)
})