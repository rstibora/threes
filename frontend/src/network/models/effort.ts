import { DateTime, Duration, Interval } from "luxon"


export interface EffortSerialized {
    id?: number
    task: number
    starts: string
    duration: number
}

export class NewEffort {
    readonly taskId: number
    readonly starts: DateTime
    readonly duration: number
    readonly interval: Interval

    constructor(taskId: number, starts: DateTime, duration: number) {
        this.taskId = taskId
        this.starts = starts
        this.duration = duration
        this.interval = Interval.fromDateTimes(
            this.starts, this.starts.plus(Duration.fromObject({ minutes: this.duration})))
    }

    serialize(): EffortSerialized {
        return {
            task: this.taskId,
            starts: this.starts.toISO(),
            duration: this.duration,
        }
    }
}

export class Effort extends NewEffort {
    id: number

    constructor(id: number, taskId: number, starts: DateTime, duration: number) {
        super(taskId, starts, duration)
        this.id = id
    }

    serialize(): EffortSerialized {
        return { id: this.id, ...super.serialize() }
    }

    static deserialize(serialized: EffortSerialized): Effort {
        if (serialized.id === undefined) {
            throw Error(`Can't deserialize ${serialized} with undefined id.`)
        }
        return new Effort(serialized.id, serialized.task, DateTime.fromISO(serialized.starts), serialized.duration)
    }
}
