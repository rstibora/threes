export interface ExistingReviewIdentification {
    id: number
    configurationId?: never,
    index?: never,
}

export interface NewReviewIdentification {
    id?: never
    configurationId: number,
    index: number,
}

/**
 * Review is identified either by DB id (existing reviews), or by its configuration id
 * and an index (in case the review is not yet saved).
*/
export type ReviewIdentification = ExistingReviewIdentification | NewReviewIdentification

export interface ReviewSerialized {
    id?: number
    configuration: number
    index: number
    planned_tasks: Array<number>
}

export class NewReview {
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
}

export class Review extends NewReview {
    id: number

    constructor(id: number, configurationId: number, index: number, plannedTasksIds: Array<number>) {
        super(configurationId, index, plannedTasksIds)
        this.id = id
    }

    serialize(): ReviewSerialized {
        return { id: this.id, ...super.serialize()}
    }

    static deserialize(serialized: ReviewSerialized): Review {
        if (serialized.id === undefined) {
            throw Error(`Can't deserialize ${serialized} with undefined id.`)
        }
        return new Review(serialized.id, serialized.configuration, serialized.index, serialized.planned_tasks)
    }
}
