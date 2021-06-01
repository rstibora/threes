import { JsonSerializable } from "src/network/models/deserializable"

export interface TaskSerialized {
    id: number
    name: string
    description: string
    created: string
}

export class Task implements JsonSerializable<TaskSerialized> {
    id: number
    name: string
    description: string
    created: Date

    constructor(serialized: TaskSerialized) {
        this.id = serialized.id
        this.name = serialized.name
        this.description = serialized.description
        this.created = new Date(serialized.created)
    }

    serialize(): TaskSerialized {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            created: this.created.toISOString(),
        }
    }
}
