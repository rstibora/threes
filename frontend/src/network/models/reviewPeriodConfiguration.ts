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
    name: string

    constructor(serialized: ReviewPeriodConfigurationSerialized) {
        this.id = serialized.id
        this.name = serialized.name
    }

    constructName(index: number, review_period_index: number): string {
        return `Karel ${index} Varel ${review_period_index}`
    }
}
