export interface TaskSerialized {
    id: number
    name: string
    description: string
    created: string
}

export class Task {
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
}
