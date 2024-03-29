import { DateTime } from "luxon"

import { Existing, Serializable } from "src/network/models/basic"


export interface TaskSerialized {
    id?: number
    name: string
    description: string
    created: string
}

export class NewTask implements Serializable<TaskSerialized> {
    name: string
    description: string
    created: DateTime

    constructor(name: string, description: string, created?: DateTime) {
        this.name = name
        this.description = description
        this.created = created !== undefined ? created : DateTime.now()
    }

    serialize(): TaskSerialized {
        return {
            name: this.name,
            description: this.description,
            created: this.created.toISO(),
        }
    }
}

export class Task extends NewTask implements Existing<TaskSerialized> {
    id: number

    constructor(id: number, name: string, description: string, created: DateTime) {
        super(name, description, created)
        this.id = id
    }

    serialize(): TaskSerialized {
        return { id: this.id, ...super.serialize() }
    }
}

export function deserializeTask(serialized: TaskSerialized): Task {
    if (serialized.id === undefined) {
        throw Error(`Can't deserialize ${serialized} with undefined id.`)
    }
    return new Task(serialized.id, serialized.name, serialized.description, DateTime.fromISO(serialized.created))
}