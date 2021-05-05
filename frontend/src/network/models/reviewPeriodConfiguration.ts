export interface ReviewPeriodConfigurationSerialized {
    id: number
    name: string
    base_duration: string
    multiplier: number
    starts: string
    index_type: string
    index_reset_duration: string
}

export class ReviewPeriodConfiguration {
    id: number
    starts: Date
    indexType: string

    constructor(serialized: ReviewPeriodConfigurationSerialized) {
        this.id = serialized.id
        this.starts = new Date(serialized.starts)
        this.indexType = serialized.index_type
    }

    constructName(index: number, review_period_index: number): string {
        let baseName = "Week"
        if (this.indexType == "FN") {
            baseName = "Fornight"
        } else if (baseName == "MN") {
            baseName = ""
        }
        const year = this.starts.getFullYear() + review_period_index
        return `${baseName} ${index} ${year}`
    }
}
