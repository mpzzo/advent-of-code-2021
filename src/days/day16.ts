import { Input, OptionSelector } from "../input.ts"

enum PacketType {
    SUM = 0,
    PRODUCT = 1,
    MINIMUM = 2,
    MAXIMUM = 3,
    LITERAL = 4,
    GREATER_THAN = 5,
    LESS_THAN = 6,
    EQUAL_TO = 7
}

type PacketTypeReducer = (values: number[]) => number

const packetTypeReducers: {[key in PacketType]: PacketTypeReducer} = {
    [PacketType.SUM]:          (values: number[]) => values.reduce((c, v) => c + v, 0),
    [PacketType.PRODUCT]:      (values: number[]) => values.reduce((c, v) => c * v, 1),
    [PacketType.MINIMUM]:      (values: number[]) => Math.min.apply(this, values),
    [PacketType.MAXIMUM]:      (values: number[]) => Math.max.apply(this, values),
    [PacketType.LITERAL]:      (values: number[]) => values.length === 1 ? values[0] : 0,
    [PacketType.GREATER_THAN]: (values: number[]) => values.length === 2 && values[0] > values[1] ? 1 : 0,
    [PacketType.LESS_THAN]:    (values: number[]) => values.length === 2 && values[0] < values[1] ? 1 : 0,
    [PacketType.EQUAL_TO]:     (values: number[]) => values.length === 2 && values[0] === values[1] ? 1 : 0
}

function calculatePacket(p: Packet): number {
    if (isLiteralPacket(p)) {
        return p.value
    } else if (isOperatorPacket(p)) {
        const values = p.subpackets.map((subpacket) => calculatePacket(subpacket))
        return packetTypeReducers[p.typeId](values)
    } else {
        return 0
    }
}

interface Packet {
    version: number,
    typeId: PacketType
}

interface LiteralPacket extends Packet {
    value: number
}

interface OperatorPacket extends Packet {
    subpackets: Packet[]
}

function isLiteralPacket(p: Packet): p is LiteralPacket {
    return p.typeId === PacketType.LITERAL
}

function isOperatorPacket(p: Packet): p is OperatorPacket {
    return p.typeId !== PacketType.LITERAL
}

export function getPacket(data: string): Packet {
    let cursor = 0
    const next = (bits: number): number => {
        // const cursorPrev = cursor
        const cursorNext = cursor + bits
        const start = Math.floor(cursor / 4)
        const end = Math.ceil(cursorNext / 4)
        const shift = (end * 4) - cursorNext
        const mask = (1 << bits) - 1

        cursor = cursorNext
        let next = Number.parseInt(data.slice(start, end), 16)
        next = (next >> shift) & mask
        return next
    }

    const parseLiteralPacket = () => {
        let hex = ''
        let done = false
        while (!done) {
            const group = next(5)
            hex += new Number(group & 15).toString(16)
            if ((group & 16) === 0) {
                done = true
            }
        }
        return { value: Number.parseInt(hex, 16) }
    }

    const parseOperatorPacket = () => {
        const lengthTypeId = next(1)
        const subpackets = []
        if (lengthTypeId === 0) {
            const lengthSubPackets = next(15)
            const limit = cursor + lengthSubPackets
            while (cursor < limit) {
                subpackets.push(parsePacket())
            }
        } else if (lengthTypeId === 1) {
            const numSubPackets = next(11)
            for (let i = 0; i < numSubPackets; i++) {
                subpackets.push(parsePacket())
            }
        }
        return { subpackets }
    }

    const parsePacket = () => {
        const version = next(3)
        const typeId = next(3)
        let packet: Packet
        if (typeId === PacketType.LITERAL) {
            packet = { version, typeId, ...parseLiteralPacket() }
        } else {
            packet = { version, typeId, ...parseOperatorPacket() }
        }
        return packet
    }

    return parsePacket()
}

function getVersionSum(p: Packet): number {
    let sum = 0
    const stack = [p]
    while (stack.length > 0) {
        const packet = stack.pop() as Packet
        if (isOperatorPacket(packet)) {
            for (const subpacket of packet.subpackets) {
                stack.push(subpacket)
            }
        }
        sum += packet.version
    }
    return sum
}

export async function run(input: Input, _: OptionSelector) {
    const data = (await input.toArray()).join('')
    const packet = getPacket(data)
    return {
        versionSum: getVersionSum(packet),
        evaluation: calculatePacket(packet)
    }
}