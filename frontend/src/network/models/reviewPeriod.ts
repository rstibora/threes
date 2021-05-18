import { DateTime, Duration } from "luxon"

import { ReviewPeriodConfiguration } from "src/network/models/reviewPeriodConfiguration"

export interface ReviewPeriodSerialized {
    id: number
    configuration: number
    planned_tasks: Array<number>
    index: number
    review_period_index: number
    starts: string
    ends: string
}

export class ReviewPeriod {
    id: number
    index: number
    reviewPeriodIndex: number
    configuration: ReviewPeriodConfiguration
    plannedTasksIds: Array<number>
    starts: DateTime
    ends: DateTime

    constructor(serialized: ReviewPeriodSerialized, configuration: ReviewPeriodConfiguration) {
        this.id = serialized.id
        this.index = serialized.index
        this.reviewPeriodIndex = serialized.review_period_index
        this.configuration = configuration
        // TODO: pass in them tasks?
        this.plannedTasksIds = serialized.planned_tasks
        this.starts = DateTime.fromISO(serialized.starts)
        this.ends = DateTime.fromISO(serialized.ends)
    }

    name(): string {
        return this.configuration.constructName(this.index, this.reviewPeriodIndex)
    }
}
