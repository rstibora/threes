export interface ReviewSerialized {
    id?: number
    configuration: number
    index: number
    planned_tasks: Array<number>
}

export class Review {
    configurationId: number
    index: number
    plannedTasksIds: Array<number>

    constructor(configurationId: number, index: number, plannedTasksIds: Array<number>) {
        this.configurationId = configurationId
        this.index = index
        this.plannedTasksIds = plannedTasksIds
    }

    serialize(): ReviewSerialized {
        return {
            configuration: this.configurationId,
            index: this.index,
            planned_tasks: this.plannedTasksIds
        }
    }

    static deserialize(serialized: ReviewSerialized): Review {
        return new Review(serialized.configuration, serialized.index, serialized.planned_tasks)
    }
}
