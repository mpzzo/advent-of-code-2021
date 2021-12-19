import { walk } from "https://deno.land/std@0.118.0/fs/mod.ts"
import { resolve, relative } from "https://deno.land/std@0.118.0/path/mod.ts";

const getTestFileContents = (runPath: string, inputPath = '../input.ts') => `\
import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts"
import { run } from "${runPath}"
import { createInputFromString, parseArgs } from "${inputPath}"

const INPUT = \`\\
test payload goes here!
\`

Deno.test("run", async () => {
    const input = createInputFromString(INPUT)
    const options = parseArgs()
    const result = await run(input, options)
    assertEquals(result, 0)
})\
`

const getRunFileContents = (inputPath = '../input.ts') => `\
import { Input, OptionSelector } from "${inputPath}"

export async function run(input: Input, options: OptionSelector) {
    return await Promise.resolve(0)
}\
`

const getRunnersFileContents = (dayImports: string, dayRunners: string) => `\
import { Input, OptionSelector } from "./input.ts"
${dayImports}

// deno-lint-ignore no-explicit-any
type Runner = (input: Input, options: OptionSelector) => any

const runners: {[key: number]: Runner} = {${dayRunners}}
export default runners\
` 

async function buildRunnersFile(srcPath: string) {
    const days = []
    const daysPath = resolve(srcPath, 'days')
    for await (const entry of walk(daysPath, {
        maxDepth: 1,
        includeDirs: false,
        exts: ['ts'],
        skip: [/.*\.test\.ts/]
    })) {
        days.push(entry.path.slice(daysPath.length + 1, -3))
    }

    days.sort()

    const runImportEntries = days
        .map((day) => `import { run as ${day} } from "./days/${day}.ts"`)
        .join('\n')

    const runEntries = days
        .map((day) => `${Number.parseInt(day.substring(3))}:${day}`)
        .join(',')

    return getRunnersFileContents(runImportEntries, runEntries)
}

async function writeRunFiles(day: number, srcPath: string) {
    const name = `day${day.toString().padStart(2, '0')}`
    const daysPath = resolve(srcPath, 'days')
    for await (const entry of walk(daysPath, { match: [new RegExp(`${name}(\.ts|\.test\.ts)$`)]})) {
        console.error('cannot create run files because file exists:', entry.path)
        throw new Error('creation of boilerplate failed.')
    }

    const runPath = resolve(daysPath, `${name}.ts`)
    const testPath = resolve(daysPath, `${name}.test.ts`)
    
    const inputPath = resolve(srcPath, 'input.ts')
    const runnersPath = resolve(srcPath, 'runners.ts')
    
    const relativeInputPath = relative(daysPath, inputPath)

    const encoder = new TextEncoder()
    await Deno.writeFile(runPath, encoder.encode(getRunFileContents(relativeInputPath))),
    await Deno.writeFile(testPath, encoder.encode(getTestFileContents(`./${name}.ts`, relativeInputPath)))
    await Deno.writeFile(runnersPath, encoder.encode(await buildRunnersFile(srcPath)))
}

for (const arg of Deno.args) {
    const day = Number.parseInt(arg)
    console.log('attempting to create boilerplate for day', day, '...')
    await writeRunFiles(day, './src')
    console.log('boilerplate creation successful.')
}