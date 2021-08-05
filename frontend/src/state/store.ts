import { State } from "@vue/runtime-core"
import { createStore } from "vuex"

import { Session } from "src/state/session"
import { fetchResource } from "src/network/fetchResource"

import { Effort, NewEffort, EffortSerialized } from "src/network/models/effort"
import { Review, NewReview, ReviewSerialized } from "src/network/models/review"
import { ReviewConfiguration, ReviewConfigurationSerialized } from "src/network/models/reviewConfiguration"
import { Task, NewTask, TaskSerialized } from "src/network/models/task"
import { UserReviewConfiguration, NewUserReviewConfiguration, UserReviewConfigurationSerialized } from "src/network/models/userReviewConfiguration"


export type MapById<T> = Map<number, T>

export default createStore({
    state() {
        return {
            efforts: new Map<number, Effort>(),
            reviews: new Map<number, Review>(),
            reviewConfigurations: new Map<number, ReviewConfiguration>(),
            session: undefined as Session | undefined,
            tasks: new Map<number, Task>(),
            userReviewConfigurations: new Map<number, UserReviewConfiguration>(),
        }
    },
    mutations: {
        updateEfforts(state: State, payload: MapById<Effort>) {
            state.efforts = payload
        },
        updateReviews(state: State, payload: MapById<Review>) {
            state.reviews = payload
        },
        updateReviewConfigurations(state: State, payload: MapById<ReviewConfiguration>) {
            state.reviewConfigurations = payload
        },
        updateTasks(state: State, payload: MapById<Task>) {
            state.tasks = payload
        },
        updateSession(state: State, payload: {session?: Session}) {
            state.session = payload.session
        },
        updateUserReviewConfigurations(state: State, payload: MapById<UserReviewConfiguration>) {
            state.userReviewConfigurations = payload
        },
    },
    actions: {
    async refreshToken({ state, commit }): Promise<boolean> {
      if (state.session != null) {
        return true
      }

      // TODO: handle exceptions (in case of disconnect).
      const refreshResponse = await fetchResource("POST", "/api/token/refresh/")
      if (!refreshResponse.ok) {
        return false
      }

      const refreshResponseJson = await refreshResponse.json()
      commit("updateSession", {"session": new Session(refreshResponseJson["access"])})
      return true
    },
    async fetchResourceWithToken({ state, dispatch }, payload: { method: string, apiPath: string, data?: Object}): Promise<Response> {
      if (await dispatch("refreshToken")) {
        return await fetchResource(payload.method, payload.apiPath, payload.data, state.session?.accessJwt)
      }
      return Promise.reject("Could not refresh token")
    },

    // Model fetch actions.
    async fetchEfforts({ dispatch, commit }) {
      const response: Response = await dispatch("fetchResourceWithToken", { method: "GET", apiPath: "/api/efforts" })
      if (!response.ok) {
        return
      }
      const json: Array<EffortSerialized> = await response.json()
      let efforts = new Map<number, Effort>()
      for (const effortSerialized of json) {
        const effort = Effort.deserialize(effortSerialized)
        efforts.set(effort.id, effort)
      }
      commit("updateEfforts", efforts)
    },
    async fetchTasks({ dispatch, commit }) {
      const response: Response = await dispatch("fetchResourceWithToken", { method: "GET", apiPath: "/api/tasks" })
      if (!response.ok) {
        return
      }
      const json: Array<TaskSerialized> = await response.json()
      let tasks = new Map<number, Task>()
      for (const taskSerialized of json) {
        const task = Task.deserialize(taskSerialized)
        tasks.set(task.id, task)
      }
      commit("updateTasks", tasks)
    },
    async fetchReviews({ dispatch, commit }) {
        const responses: [Response, Response, Response] = await Promise.all([
            dispatch("fetchResourceWithToken", { method: "GET", apiPath: "/api/review_configurations" }),
            dispatch("fetchResourceWithToken", { method: "GET", apiPath: "/api/user_review_configurations" }),
            dispatch("fetchResourceWithToken", { method: "GET", apiPath: "/api/reviews" })
        ])
        if (!responses.every(response => response.ok)) {
            return
        }

        const [configurationsJson, userConfigurationsJson, reviewsJson] = await Promise.all(responses.map(response => response.json()))

        let configurations = new Map<number, ReviewConfiguration>()
        for (const configurationSerialized of configurationsJson as Array<ReviewConfigurationSerialized>) {
            const configuration = ReviewConfiguration.deserialize(configurationSerialized)
            configurations.set(configuration.id, configuration)
        }

        let userConfigurations = new Map<number, UserReviewConfiguration>()
        for (const userConfigurationSerialized of userConfigurationsJson as Array<UserReviewConfigurationSerialized>) {
            const userReview = UserReviewConfiguration.deserialize(userConfigurationSerialized)
            userConfigurations.set(userReview.id, userReview)
        }

        let reviews = new Map<number, Review>()
        for (const reviewSerialized of reviewsJson as Array<ReviewSerialized>) {
            const review = Review.deserialize(reviewSerialized)
            reviews.set(review.id, review)
        }
        commit("updateReviewConfigurations", configurations)
        commit("updateUserReviewConfigurations", userConfigurations)
        commit("updateReviews", reviews)
    },

    async updateEffort({ dispatch, commit, state }, payload: { effort: Effort }) {
      const response: Response = await dispatch("fetchResourceWithToken",
                                                { method: "PUT", apiPath: `/api/efforts/${payload.effort.id}/`,
                                                  data: payload.effort.serialize() })
      if (!response.ok) {
        throw Error("Could not update effort.")
      }

      const efforts = new Map(state.efforts)
      efforts.set(payload.effort.id, payload.effort)
      commit("updateEfforts", efforts)
    },
    async createEffort({ dispatch, commit, state }, payload: { effort: Effort }): Promise<Effort> {
      const response: Response = await dispatch("fetchResourceWithToken",
                                                { method: "POST", apiPath: `/api/efforts/`,
                                                  data: payload.effort.serialize() })
      if (!response.ok) {
        throw Error("Could not create new effort.")
      }
      const responseJson: EffortSerialized = await response.json()
      const newEffort = Effort.deserialize(responseJson)
      let efforts = new Map(state.efforts)
      efforts.set(newEffort.id, newEffort)
      commit("updateEfforts", efforts)
      return newEffort
    },
    async updateTask({ dispatch, commit, state }, payload: { id: number, task: Task }) {
      const response: Response = await dispatch("fetchResourceWithToken",
                                                { method: "PUT", apiPath: `/api/tasks/${payload.id}/`,
                                                  data: { id: payload.id, ...payload.task.serialize() }})
      if (!response.ok) {
        throw Error("Could not update task.")
      }

      const tasks = new Map(state.tasks)
      tasks.set(payload.id, payload.task)
      commit("updateTasks", tasks)
    },
    async createTask({ dispatch, commit, state }, payload: { task: NewTask }): Promise<Task> {
      const response: Response = await dispatch("fetchResourceWithToken",
                                                { method: "POST", apiPath: `/api/tasks/`,
                                                  data: payload.task.serialize() })
      if (!response.ok) {
        throw Error("Could not create a new task.")
      }
      const taskSerialized: TaskSerialized = await response.json()
      const newTask = Task.deserialize(taskSerialized)
      let allTasks = new Map(state.tasks)
      allTasks.set(newTask.id, newTask)
      commit("updateTasks", allTasks)
      return newTask
    }
  },
})
