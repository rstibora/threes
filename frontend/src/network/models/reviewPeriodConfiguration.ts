import { DateTime, Duration } from "luxon"

import { getStringEnumKeyByValue } from "src/utils/enum"


export interface ReviewPeriodConfigurationSerialized {
    id: number
    name: string
    base_duration: string
    multiplier: number
    starts: string
    index_type: string
    index_reset_duration: string
}


enum IndexType {
    WEEK_NUMBER = "WN",
    FORTNIGHT_NUMBER = "FN",
    MONTH_NAME = "MN",
    QUARTER_NUMBER = "QN",
    INTEGER = "IN"
}


export class ReviewPeriodConfiguration {
    id: number
    starts: DateTime
    indexType: IndexType
    duration: Duration

    constructor(serialized: ReviewPeriodConfigurationSerialized) {
        this.id = serialized.id
        this.starts = DateTime.fromISO(serialized.starts)
        this.indexType = IndexType[getStringEnumKeyByValue(IndexType, serialized.index_type)]

        let durationObject: any = {}
        if (serialized.base_duration == "D") {
            durationObject.days = serialized.multiplier
        } else if (serialized.base_duration == "W") {
            durationObject.weeks = serialized.multiplier
        } else if (serialized.base_duration == "M") {
            durationObject.months = serialized.multiplier
        } else  if (serialized.base_duration == "Y") {
            durationObject.years = serialized.multiplier
        } else {
            throw Error(`Unknown base duration ${serialized.base_duration}`)
        }
        this.duration = Duration.fromObject(durationObject)
    }

    constructName(index: number, review_period_index: number): string {
        let baseName = "Week"
        if (this.indexType == IndexType.FORTNIGHT_NUMBER) {
            baseName = "Fornight"
        } else if (this.indexType == IndexType.MONTH_NAME) {
            baseName = ""
        } else if (this.indexType == IndexType.QUARTER_NUMBER) {
            baseName = ""
        }
        let stringIndex = index.toString()
        if (this.indexType == IndexType.MONTH_NAME) {
            stringIndex = new Date(1991, index).toLocaleString("default", { month: "long"})
        } else if (this.indexType == IndexType.QUARTER_NUMBER) {
            return ["Q1", "Q2", "Q3", "Q4"][index]
        }
        const year = this.starts.year + review_period_index

        return `${baseName}${baseName.length == 0 ? "" : " "}${stringIndex} ${year}`
    }

    getDatesForIndices(index: number, review_period_index: number): [DateTime, DateTime] {
        let starts = this.starts
        for (let i = 0; i < index; i++) {
            starts = starts.plus(this.duration)
        }
        const ends = starts.plus(this.duration)
        return [starts, ends]
    }
}
