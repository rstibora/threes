import { Module, Store as VuexStore } from "vuex"

import { MapById } from "src/utils/types"

import { Review, ReviewSerialized } from "src/network/models/review"
import { ReviewConfiguration, ReviewConfigurationSerialized } from "src/network/models/reviewConfiguration"
import { UserReviewConfiguration, UserReviewConfigurationSerialized } from "src/network/models/userReviewConfiguration"

import { Actions, Mutations } from "src/state/storeAccess"

import { updateOrDeleteInMap } from "src/state/modules/moduleUtils"


export type State = {
    reviews: MapById<Review>,
    configurations: MapById<ReviewConfiguration>
    userConfigurations: MapById<UserReviewConfiguration>
}

export type Store<S = State> = VuexStore<S>

export const ReviewsModule: Module<State, any> = {
    state: () => ({
        reviews: new Map<number, Review>(),
        configurations: new Map<number, ReviewConfiguration>(),
        userConfigurations: new Map<number, UserReviewConfiguration>(),
    }),
    mutations: {
        [Mutations.UPDATE_REVIEWS] (state: State, payload: { reviews: MapById<Review> }) {
            updateOrDeleteInMap(state.reviews, payload.reviews)
        },
        [Mutations.UPDATE_REVIEW_CONFIGURATIONS] (state: State, payload: { configurations: MapById<ReviewConfiguration> }) {
            updateOrDeleteInMap(state.configurations, payload.configurations)
        },
        [Mutations.UPDATE_USER_REVIEW_CONFIGURATIONS] (state: State, payload: { userConfigurations: MapById<UserReviewConfiguration> }) {
            updateOrDeleteInMap(state.userConfigurations, payload.userConfigurations)
        },
    },
    actions: {
        async [Actions.FETCH_REVIEWS] ({ dispatch, commit }): Promise<MapById<Review>> {
            // TODO: handle failure cases.
            const response: Response = await dispatch(
                Actions.FETCH_RESOURCE, { method: "GET", apiPath: "/api/reviews" })
            const reviewsSerialized: Array<ReviewSerialized> = await response.json()
            let reviews = new Map()
            for (const reviewSerialized of reviewsSerialized) {
                const review = Review.deserialize(reviewSerialized)
                reviews.set(review.id, review)
            }
            commit(Mutations.UPDATE_REVIEWS, { reviews })
            return reviews
        },
        async [Actions.FETCH_REVIEW_CONFIGURATIONS] ({ dispatch, commit }): Promise<MapById<ReviewConfiguration>> {
            // TODO: handle failure cases.
            const response: Response = await dispatch(
                Actions.FETCH_RESOURCE, { method: "GET", apiPath: "/api/review_configurations" })
            const configurationsSerialized: Array<ReviewConfigurationSerialized> = await response.json()
            let configurations = new Map()
            for (const configurationSerialized of configurationsSerialized) {
                const configuration = ReviewConfiguration.deserialize(configurationSerialized)
                configurations.set(configuration.id, configuration)
            }
            commit(Mutations.UPDATE_REVIEW_CONFIGURATIONS, { configurations })
            return configurations
        },
        async [Actions.FETCH_USER_REVIEW_CONFIGURATIONS] ({ dispatch, commit }): Promise<MapById<UserReviewConfiguration>> {
            // TODO: handle failure cases.
            const response: Response = await dispatch(
                Actions.FETCH_RESOURCE, { method: "GET", apiPath: "/api/user_review_configurations" })
            const userConfigurationsSerialized: Array<UserReviewConfigurationSerialized> = await response.json()
            let userConfigurations = new Map()
            for (const userConfigurationSerialized of userConfigurationsSerialized) {
                const userConfiguration = UserReviewConfiguration.deserialize(userConfigurationSerialized)
                userConfigurations.set(userConfiguration.id, userConfiguration)
            }
            commit(Mutations.UPDATE_USER_REVIEW_CONFIGURATIONS, { userConfigurations })
            return userConfigurations
        },
    }
}
