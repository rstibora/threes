import { DateTime } from "luxon"

export interface EffortSerialized {
    id: number
    task: number
    starts: string
    duration: number
}

export class Effort {
    id: number
    taskId: number
    starts: DateTime
    duration: number

    constructor(serialized: EffortSerialized) {
        this.id = serialized.id
        this.taskId = serialized.task
        this.starts = DateTime.fromISO(serialized.starts)
        this.duration = serialized.duration
    }
}
