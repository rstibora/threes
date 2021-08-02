import { DateTime } from "luxon"


export interface EffortSerialized {
    id?: number
    task: number
    starts: string
    duration: number
}

export class Effort {
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

    static deserialize(serialized: EffortSerialized): Effort {
        return new Effort(serialized.task, DateTime.fromISO(serialized.starts), serialized.duration)
    }
}
