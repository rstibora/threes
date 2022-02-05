export interface UserReviewConfigurationSerialized {
    id?: number
    user: number
    configuration: number
    is_active: boolean
}

export class NewUserReviewConfiguration {
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

export class UserReviewConfiguration extends NewUserReviewConfiguration{
    id: number

    constructor(id: number, userId: number, configurationId: number, isActive: boolean) {
        super(userId, configurationId, isActive)
        this.id = id
    }

    serialize(): UserReviewConfigurationSerialized {
        return { id: this.id, ...super.serialize() }
    }

    static deserialize(serialized: UserReviewConfigurationSerialized): UserReviewConfiguration {
        if (serialized.id === undefined) {
            throw Error(`Can't deserialize ${serialized} with undefined id.`)
        }
        return new UserReviewConfiguration(serialized.id, serialized.user, serialized.configuration, serialized.is_active)
    }
}

export function deserializeUserReviewConfiguration(serialized: UserReviewConfigurationSerialized): UserReviewConfiguration {
    if (serialized.id === undefined) {
        throw Error(`Can't deserialize ${serialized} with undefined id.`)
    }
    return new UserReviewConfiguration(serialized.id, serialized.user, serialized.configuration, serialized.is_active)
}
