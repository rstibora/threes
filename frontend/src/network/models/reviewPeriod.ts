import { ReviewPeriodConfiguration } from "src/network/models/reviewPeriodConfiguration"

export interface ReviewPeriodSerialized {
    id: number
    configuration: number
    planned_tasks: Array<number>
    index: number
    review_period_index: number
}

export class ReviewPeriod {
    id: number
    index: number
    reviewPeriodIndex: number
    configuration: ReviewPeriodConfiguration
    planned_tasks_ids: Array<number>

    constructor(serialized: ReviewPeriodSerialized, configuration: ReviewPeriodConfiguration) {
        this.id = serialized.id
        this.index = serialized.index
        this.reviewPeriodIndex = serialized.review_period_index
        this.configuration = configuration
        // TODO: pass in them tasks?
        this.planned_tasks_ids = serialized.planned_tasks
    }

    name(): string {
        return this.configuration.constructName(this.index, this.reviewPeriodIndex)
    }
}
