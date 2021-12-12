import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts"
import { createInputFromString, parseArgs } from "../input.ts"
import { run, getLightConfiguration, lightCode } from "./day08.ts"

const INPUT = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce
`

Deno.test("getSignalPattern", () => {
    const input = ['acedgfb', 'cdfbe', 'gcdfa', 'fbcad', 'dab', 'cefabd', 'cdfgeb', 'eafb', 'cagedb', 'ab']
    const config = getLightConfiguration(input)
    assertEquals(config.get(lightCode(input[0])), 8)
    assertEquals(config.get(lightCode(input[1])), 5)
    assertEquals(config.get(lightCode(input[2])), 2)
    assertEquals(config.get(lightCode(input[3])), 3)
    assertEquals(config.get(lightCode(input[4])), 7)
    assertEquals(config.get(lightCode(input[5])), 9)
    assertEquals(config.get(lightCode(input[6])), 6)
    assertEquals(config.get(lightCode(input[7])), 4)
    assertEquals(config.get(lightCode(input[8])), 0)
    assertEquals(config.get(lightCode(input[9])), 1)
})

Deno.test("run", async () => {
    const input = createInputFromString(INPUT)
    const options = parseArgs()
    const { count1478, sum } = await run(input, options)
    assertEquals(count1478, 26)
    assertEquals(sum, 61229)
})