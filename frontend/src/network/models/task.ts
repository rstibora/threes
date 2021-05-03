interface TaskSerialized {
    name: string
    description: string
    created: string
}

export class Task {
    name: string
    description: string
    created: Date

    constructor(serialized: TaskSerialized) {
        this.name = serialized.name
        this.description = serialized.description
        this.created = new Date(serialized.created)
    }
}
