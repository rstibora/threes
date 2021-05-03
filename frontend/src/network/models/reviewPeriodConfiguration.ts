interface ReviewPeriodConfigurationSerialized {
    name: string
    base_duration: string
    multiplier: number
    starts: string
    index_type: string
    index_reset_duration: string
}

export class ReviewPeriodConfiguration {
    name: string

    constructor(serialized: ReviewPeriodConfigurationSerialized) {
        this.name = serialized.name
    }
}
