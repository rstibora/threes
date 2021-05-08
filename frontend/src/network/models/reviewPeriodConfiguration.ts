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
    starts: Date
    indexType: IndexType

    constructor(serialized: ReviewPeriodConfigurationSerialized) {
        this.id = serialized.id
        this.starts = new Date(serialized.starts)
        this.indexType = IndexType[getStringEnumKeyByValue(IndexType, serialized.index_type)]
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
        const year = this.starts.getFullYear() + review_period_index

        return `${baseName}${baseName.length == 0 ? "" : " "}${stringIndex} ${year}`
    }
}
