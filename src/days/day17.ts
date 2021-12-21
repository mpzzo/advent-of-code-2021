import { Input, OptionSelector } from "../input.ts"

interface Range {
    from: number,
    to: number
}

interface TargetArea {
    x: Range,
    y: Range
}

function getVerticalVelocityMap(area: TargetArea): Map<number, number[]> {
    const map = new Map<number, number[]>()
    const minVelocity = area.y.from
    const maxVelocity = getVerticalMaxVelocity(area)

    // Between the minimum and maximum initial velocities, calculate how much steps it takes
    // to reach the target area.
    for (let i = minVelocity; i <= maxVelocity; i++) {
        let steps = 0
        let displacement = 0
        let velocity = i
        while (displacement >= area.y.from || velocity > 0) {
            displacement += velocity
            velocity--
            steps++
            if (area.y.from <= displacement && displacement <= area.y.to) {
                const stepVelocities = map.get(steps) ?? []
                stepVelocities.push(i)
                map.set(steps, stepVelocities)
            }
        }
    }
    return map
}

function testPath(area: TargetArea, velocity: string) {
    const key = (x: number, y: number): string => `${x},${y}`
    const path = []
    let x = 0
    let y = 0
    let [deltaX, deltaY] = velocity.split(',').map(n => Number.parseInt(n))
    while ((y >= area.y.from || deltaY > 0) && x <= area.x.to) {
        x += deltaX
        y += deltaY
        deltaX = deltaX > 0 ? deltaX - 1 : 0
        deltaY -= 1
        path.push(key(x, y))
        if (area.x.from <= x && x <= area.x.to && area.y.from <= y && y <= area.y.to) {
            console.log('hit', velocity, path, x, y)
            return
        }
    }
    console.log('miss', velocity, path, x, y)
}

function getHorizontalVelocityDetails(area: TargetArea) {
    let velocity = 0
    let distance = 0

    // Get the minimum initial velocity required to reach the target area.
    while (distance < area.x.from) {
        velocity++
        distance += velocity
    }
    const minVelocity = velocity

    // Get the minimum initial velocity required to escape the target area.
    while (distance <= area.x.to) {
        velocity++
        distance += velocity
    }
    const escapeVelocity = velocity

    // Calculate the number of steps each initial velocity takes to reach the target area.
    let i = 0
    const stepVelocityMap = new Map<number, number[]>()
    while (velocity <= area.x.to) {
        while (distance > area.x.to) {
            i++
            distance -= i
        }

        let tempDistance = distance
        let j = i
        while (tempDistance >= area.x.from) {
            const steps = velocity - j
            const stepVelocities = stepVelocityMap.get(steps) ?? []
            stepVelocities.push(velocity)
            stepVelocityMap.set(steps, stepVelocities)
            
            j++
            tempDistance -= j
        }
    
        velocity++
        distance += velocity
    }

    return {
        minVelocity,
        escapeVelocity,
        stepVelocityMap
    }
}

function getStepsToDistance(target: number, velocity: number): number {
    let steps = 0
    let distance = 0
    let delta = velocity
    while (distance < target && delta > 0) {
        distance += delta
        delta--
        steps++
    }
    if (delta === 0) {
        // If delta reaches zero, then the initial velocity would never converge on the
        // target distance. Throw an error, since this would mean a miscalculation happened
        // somewhere.
        throw new Error('velocity does not reach distance.')
    }
    return steps
}

function getInitialVelocities(area: TargetArea): Set<string> {
    const set = new Set<string>()
    const horizontal = getHorizontalVelocityDetails(area)
    const vertical = getVerticalVelocityMap(area)
    const key = (x: number, y: number): string => `${x},${y}`

    const { minVelocity, escapeVelocity } = horizontal
    for (let x = minVelocity; x < escapeVelocity; x++) {
        const minSteps = getStepsToDistance(area.x.from, x)
        for (const [steps, yVelocities] of vertical) {
            if (steps < minSteps) {
                // horizontal and vertical velocities would not reach the target area
                // at the same time in this case, so skip these velocity entries.
                continue
            }
            for (const y of yVelocities) {
                set.add(key(x, y))
            }
        }
    }

    for (const [steps, xVelocities] of horizontal.stepVelocityMap) {
        const yVelocities = vertical.get(steps) ?? []
        for (const y of yVelocities) {
            for (const x of xVelocities) {
                set.add(key(x, y))
            }
        }
    }

    return set
}

function getVerticalMaxVelocity(area: TargetArea): number {
    const { from, to } = area.y
    const v = Math.abs(from) >= Math.abs(to) ? from : to
    return v < 0 ? Math.abs(v + 1) : v
}

function getMaximumHeight(area: TargetArea): number {
    // Calculate initial vertical velocity
    const maxVelocity = getVerticalMaxVelocity(area)
 
    // Velocity will decrease by 1 until it hits the apex when v = 0.
    // Distance = 1 + 2 + 3 + ... + v = 0.5 * v * (v + 1)
    return 0.5 * maxVelocity * (maxVelocity + 1)
}

export async function run(input: Input, _: OptionSelector) {
    const areas = []
    for await (const line of input.read()) {
        let x = { from: 0, to: 0 }
        let y = { from: 0, to: 0 }
        if (line.startsWith("target area: ")) {
            for (const dim of line.substring(13).split(", ")) {
                const [ from, to ] = dim.substring(2).split("..").map(num => Number.parseInt(num)) 
                if (dim.startsWith("x=")) {
                    x = { from, to }
                } else if (dim.startsWith("y=")) {
                    y = { from, to }
                }
            }
        }
        areas.push({x, y})
    }

    let maxY = 0
    let initialVelocities = 0
    if (areas.length > 0) {
        maxY = getMaximumHeight(areas[0])
        const set = getInitialVelocities(areas[0])
        for (const velocity of set) {
            // Prints debug information about the initial velocity's ability to reach the target area.
            testPath(areas[0], velocity)
        }
        initialVelocities = set.size
    }

    return { maxY, initialVelocities }
}