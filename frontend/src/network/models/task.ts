import { JsonDeserializable, JsonSerializable } from "src/network/models/deserializable"


export interface TaskSerialized {
    id?: number
    name?: string
    description?: string
    created?: string
}

interface ExistingItem {
    id: number
}

export class NewTask implements JsonSerializable<TaskSerialized> {
    name: string
    description: string
    created: Date

    constructor(name: string, description: string, created?: Date) {
        this.name = name
        this.description = description
        this.created = created != null ? created : new Date(Date.now())
    }

    serialize(): TaskSerialized {
        return {
            name: this.name,
            description: this.description,
            created: this.created.toISOString(),
        }
    }
}

export class Task extends NewTask implements ExistingItem{
    id: number

    constructor(id: number, name: string, description: string, created: Date) {
        super(name, description, created)
        this.id = id
    }

    serialize(): TaskSerialized {
        return { id: this.id, ...super.serialize() }
    }

    static deserialize(serialized: TaskSerialized): Task {
        if (serialized.id == null || serialized.name == null || serialized.description == null
                || serialized.created == null) {
            throw Error(`Some fields are undefined in ${serialized}`)
        }
        return new Task(serialized.id, serialized.name, serialized.description,
                        new Date(Date.parse(serialized.created)))
    }
}

