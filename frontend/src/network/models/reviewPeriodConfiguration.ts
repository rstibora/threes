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
    YEAR_NUMBER = "YN",
    INTEGER = "IN"
}


enum IndexReset {
    END_OF_YEAR = "Y",
    NEVER = "N"
}


export class ReviewPeriodConfiguration {
    id: number
    starts: DateTime
    indexType: IndexType
    duration: Duration
    indexReset: IndexReset

    constructor(serialized: ReviewPeriodConfigurationSerialized) {
        this.id = serialized.id
        this.starts = DateTime.fromISO(serialized.starts)
        this.indexType = IndexType[getStringEnumKeyByValue(IndexType, serialized.index_type)]
        this.indexReset = IndexReset[getStringEnumKeyByValue(IndexReset, serialized.index_reset_duration)]

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
        let prefix = ""
        switch (this.indexType) {
            case IndexType.WEEK_NUMBER: { prefix = "Week"; break }
            case IndexType.FORTNIGHT_NUMBER: { prefix = "Fortnight"; break }
            case IndexType.YEAR_NUMBER: { prefix = "Year"; break }
            case IndexType.INTEGER : 
            case IndexType.MONTH_NAME:
            case IndexType.QUARTER_NUMBER: { break }
            default: { throw Error(`Unknown index type ${this.indexType}`)}
        }

        // Humans are used to indexing starting from one.
        let stringIndex = (index + 1).toString()

        if (this.indexType == IndexType.MONTH_NAME) {
            stringIndex = new Date(1991, index).toLocaleString("default", { month: "long"})
        } else if (this.indexType == IndexType.QUARTER_NUMBER) {
            stringIndex = ["Q1", "Q2", "Q3", "Q4"][index]
        } else if (this.indexType == IndexType.YEAR_NUMBER) {
            stringIndex = (this.starts.year + index).toString()
        }
        const suffix = this.indexReset == IndexReset.END_OF_YEAR ? this.starts.year + review_period_index : ""

        return [prefix, stringIndex, suffix].join(" ")
    }

    getDatesForIndices(index: number, review_period_index: number): [DateTime, DateTime] {
        let starts = this.starts.plus(Duration.fromObject({ years: this.indexReset == IndexReset.END_OF_YEAR ? review_period_index : 0 }))
        for (let i = 0; i < index; i++) {
            starts = starts.plus(this.duration)
        }
        const ends = starts.plus(this.duration)
        return [starts, ends]
    }
}
