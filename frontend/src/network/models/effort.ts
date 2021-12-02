import { DateTime, Duration, Interval } from "luxon"


export interface EffortSerialized {
    id?: number
    task: number
    starts: string
    duration: number
    description: string
}

export class NewEffort {
    readonly taskId: number
    readonly starts: DateTime
    readonly duration: number
    readonly interval: Interval
    readonly description: string

    constructor(taskId: number, duration: number, description: string, starts?: DateTime) {
        this.taskId = taskId
        this.starts = starts !== undefined ? starts : DateTime.now().minus(Duration.fromObject({minutes: duration}))
        this.duration = duration
        this.description = description
        this.interval = Interval.fromDateTimes(
            this.starts, this.starts.plus(Duration.fromObject({ minutes: this.duration})))
    }

    serialize(): EffortSerialized {
        return {
            task: this.taskId,
            starts: this.starts.toISO(),
            duration: this.duration,
            description: this.description,
        }
    }
}

export class Effort extends NewEffort {
    id: number

    constructor(id: number, taskId: number, duration: number, description: string, starts: DateTime) {
        super(taskId, duration, description,  starts)
        this.id = id
    }

    serialize(): EffortSerialized {
        return { id: this.id, ...super.serialize() }
    }

    static deserialize(serialized: EffortSerialized): Effort {
        if (serialized.id === undefined) {
            throw Error(`Can't deserialize ${serialized} with undefined id.`)
        }
        return new Effort(serialized.id, serialized.task, serialized.duration,
                          serialized.description, DateTime.fromISO(serialized.starts))
    }
}
