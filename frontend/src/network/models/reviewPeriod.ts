interface ReviewPeriodSerialized {
    id: number
    configuration: number
    planned_tasks: Array<number>
    index: number
    review_period_index: number
}

export class ReviewPeriod {
    id: number
    configuration_id: number
    planned_tasks_ids: Array<number>

    constructor(serialized: ReviewPeriodSerialized) {
        this.id = serialized.id
        this.configuration_id = serialized.configuration
        this.planned_tasks_ids = serialized.planned_tasks
    }
}
