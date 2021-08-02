import { DateTime } from "luxon"


export interface TaskSerialized {
    id?: number
    name: string
    description: string
    created: string
}

export class Task {
    name: string
    description: string
    created: DateTime

    constructor(name: string, description: string, created?: DateTime) {
        this.name = name
        this.description = description
        this.created = created !== undefined ? created : DateTime.now())
    }

    serialize(): TaskSerialized {
        return {
            name: this.name,
            description: this.description,
            created: this.created.toISO(),
        }
    }

    static deserialize(serialized: TaskSerialized): Task {
        return new Task(serialized.name, serialized.description, DateTime.fromISO(serialized.created))
    }
}
