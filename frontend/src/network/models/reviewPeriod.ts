import { DateTime } from "luxon"

import { ExistingItem, JsonSerializable  } from "src/network/models/base"

import { ReviewPeriodConfiguration } from "src/network/models/reviewPeriodConfiguration"


export interface ReviewPeriodSerialized {
    id?: number
    configuration?: number
    planned_tasks?: Array<number>
    index?: number
    review_period_index?: number
    starts?: string
    ends?: string
}

export class NewReviewPeriod implements JsonSerializable<ReviewPeriodSerialized> {
    index: number
    reviewPeriodIndex: number
    configurationId: number
    plannedTasksIds: Array<number>
    starts: DateTime
    ends: DateTime

    constructor(index: number, reviewPeriodIndex: number, configuration: number,
                plannedTasksIds: Array<number>, starts: DateTime, ends: DateTime) {
        this.index = index
        this.reviewPeriodIndex = reviewPeriodIndex
        this.configurationId = configuration
        this.plannedTasksIds = plannedTasksIds
        this.starts = starts
        this.ends = ends
    }

    serialize(): ReviewPeriodSerialized {
        return {
            configuration: this.configurationId,
            planned_tasks: this.plannedTasksIds,
            index: this.index,
            review_period_index: this.reviewPeriodIndex,
            starts: this.starts.toISO(),
            ends: this.ends.toISO()
        }
    }
}

export class ReviewPeriod extends NewReviewPeriod implements ExistingItem, JsonSerializable<ReviewPeriodSerialized>{
    id: number

    constructor(id: number, index: number, reviewPeriodIndex: number, configuration: number,
                plannedTasksIds: Array<number>, starts: DateTime, ends: DateTime) {
        super(index, reviewPeriodIndex, configuration, plannedTasksIds, starts, ends)
        this.id = id
    }

    serialize(): ReviewPeriodSerialized {
        return { id: this.id, ...super.serialize() }
    }

    static deserialize(serialized: ReviewPeriodSerialized): ReviewPeriod {
        if (serialized.id == null || serialized.index  == null || serialized.review_period_index == null
                || serialized.configuration == null || serialized.planned_tasks == null || serialized.starts == null
                || serialized.ends == null) {
            throw Error(`Some fields are undefined in ${serialized}`)
        }
        return new ReviewPeriod(serialized.id, serialized.index, serialized.review_period_index,
                                serialized.configuration, serialized.planned_tasks,
                                DateTime.fromISO(serialized.starts), DateTime.fromISO(serialized.ends))
    }
}
