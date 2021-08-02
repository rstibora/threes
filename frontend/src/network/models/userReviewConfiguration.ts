export interface UserReviewConfigurationSerialized {
    id?: number
    user: number
    configuration: number
    is_active: boolean
}

export class UserReviewPeriod {
    userId: number
    configurationId: number
    isActive: boolean

    constructor(userId: number, configurationId: number, isActive: boolean) {
        this.userId = userId
        this.configurationId = configurationId
        this.isActive = isActive
    }

    serialize(): UserReviewConfigurationSerialized {
        return {
            user: this.userId,
            configuration: this.configurationId,
            is_active: this.isActive,
        }
    }
}
