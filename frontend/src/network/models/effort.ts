import { DateTime } from "luxon"

import { ExistingItem, JsonSerializable } from "src/network/models/base"


export interface EffortSerialized {
    id?: number
    task?: number
    starts?: string
    duration?: number
}

export class NewEffort implements JsonSerializable<EffortSerialized> {
    taskId: number
    starts: DateTime
    duration: number

    constructor(taskId: number, starts: DateTime, duration: number) {
        this.taskId = taskId
        this.starts = starts
        this.duration = duration
    }

    serialize(): EffortSerialized {
        return {
            task: this.taskId,
            starts: this.starts.toISO(),
            duration: this.duration,
        }
    }
}

export class Effort extends NewEffort implements ExistingItem, JsonSerializable<EffortSerialized> {
    id: number

    constructor(id: number, taskId: number, starts: DateTime, duration: number) {
        super(taskId, starts, duration)
        this.id = id
    }

    serialize(): EffortSerialized {
        return { id: this.id, ...super.serialize() }
    }

    static deserialize(serialized: EffortSerialized): Effort {
        if (serialized.id == null || serialized.task == null || serialized.starts == null
                || serialized.duration == null) {
            throw Error(`Some fields are undefined in ${serialized}`)
        }
        return new Effort(serialized.id, serialized.task, DateTime.fromISO(serialized.starts),
                          serialized.duration)
    }
}
