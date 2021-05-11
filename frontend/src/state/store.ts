import { State } from "@vue/runtime-core"
import { createStore } from "vuex"

import { Session } from "src/state/session"
import { fetchResource } from "src/network/fetchResource"

import { ReviewPeriod, ReviewPeriodSerialized } from "src/network/models/reviewPeriod"
import { ReviewPeriodConfiguration, ReviewPeriodConfigurationSerialized } from "src/network/models/reviewPeriodConfiguration"
import { Task, TaskSerialized } from "src/network/models/task"


export default createStore({
  state() {
      return {
          tasks: new Map() as Map<number, Task>,
          reviewPeriodConfigurations: new Map() as Map<number, ReviewPeriodConfiguration>,
          reviewPeriods: new Map() as Map<number, ReviewPeriod>,
          session: undefined as Session | undefined,
      }
  },
  mutations: {
    updateReviewPeriods(state: State, payload: Map<number, ReviewPeriod>) {
      state.reviewPeriods = payload
    },
    updateReviewPeriodConfigurations(state: State, payload: Map<number, ReviewPeriodConfiguration>) {
      state.reviewPeriodConfigurations = payload
    },
    updateTasks(state: State, payload: Map<number, Task>) {
      state.tasks = payload
    },
    updateSession(state: State, payload: {session?: Session}) {
      state.session = payload.session
    }
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
    async fetchTasks({ dispatch, commit }) {
      const response: Response = await dispatch("fetchResourceWithToken", { method: "GET", apiPath: "/api/tasks" })
      if (!response.ok) {
        return
      }
      const json: Array<TaskSerialized> = await response.json()
      let tasks = new Map<number, Task>()
      for (const taskSerialized of json) {
        tasks.set(taskSerialized.id, new Task(taskSerialized))
      }
      commit("updateTasks", tasks)
    },
    async fetchReviewPeriods({ dispatch, commit }) {
      const responses: [Response, Response] = await Promise.all([
        dispatch("fetchResourceWithToken", { method: "GET", apiPath: "/api/review_period_configurations" }),
        dispatch("fetchResourceWithToken", { method: "GET", apiPath: "/api/review_periods" })])
      if (!responses.every(response => response.ok)) {
        return
      }
      const [configurationsJson, reviewsJson] = await Promise.all(responses.map(response => response.json()))
      let configurations = new Map<number, ReviewPeriodConfiguration>()
      for (const configuration of configurationsJson as Array<ReviewPeriodConfigurationSerialized>) {
        configurations.set(configuration.id, new ReviewPeriodConfiguration(configuration))
      }
      let reviews = new Map<number, ReviewPeriod>()
      for (const review of reviewsJson as Array<ReviewPeriodSerialized>) {
        const configuration = configurations.get(review.configuration)
        if (configurations == null) {
          console.error(`Did not get configuraiton (id ${review.configuration}for review`)
          continue
        }
        reviews.set(review.id, new ReviewPeriod(review, configuration as ReviewPeriodConfiguration))
      }
      commit("updateReviewPeriodConfigurations", configurations)
      commit("updateReviewPeriods", reviews)
    }
  },
})
