import { State } from "@vue/runtime-core"
import { createStore } from "vuex"

import { Session } from "src/state/session"
import { fetchResource } from "src/network/fetchResource"

import { Effort, EffortSerialized, NewEffort } from "src/network/models/effort"
import { ReviewPeriod, ReviewPeriodSerialized } from "src/network/models/reviewPeriod"
import { ReviewPeriodConfiguration, ReviewPeriodConfigurationSerialized } from "src/network/models/reviewPeriodConfiguration"
import { NewTask, Task, TaskSerialized } from "src/network/models/task"


export default createStore({
  state() {
      return {
        efforts: new Map<number, Effort>(),
        tasks: new Map<number, Task>(),
        reviewPeriodConfigurations: new Map<number, ReviewPeriodConfiguration>(),
        reviewPeriods: new Map<number, ReviewPeriod>(),
        session: undefined as Session | undefined,
      }
  },
  mutations: {
    updateEfforts(state: State, payload: Map<number, Effort>) {
      state.efforts = payload
    },
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
      for (const reviewSerialized of reviewsJson as Array<ReviewPeriodSerialized>) {
        const review = ReviewPeriod.deserialize(reviewSerialized)
        reviews.set(review.id, review)
      }
      commit("updateReviewPeriodConfigurations", configurations)
      commit("updateReviewPeriods", reviews)
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
    async createEffort({ dispatch, commit, state }, payload: { effort: NewEffort }): Promise<Effort> {
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
    async updateTask({ dispatch, commit, state }, payload: { task: Task }) {
      const response: Response = await dispatch("fetchResourceWithToken",
                                                { method: "PUT", apiPath: `/api/tasks/${payload.task.id}/`,
                                                  data: payload.task.serialize() })
      if (!response.ok) {
        throw Error("Could not update task.")
      }

      const tasks = new Map(state.tasks)
      tasks.set(payload.task.id, payload.task)
      commit("updateTasks", tasks)
    },
    async createTask({ dispatch, commit, state }, payload: { task: NewTask }): Promise<Task> {
      const response: Response = await dispatch("fetchResourceWithToken",
                                                { method: "POST", apiPath: `/api/tasks/`,
                                                  data: payload.task.serialize() })
      if (!response.ok) {
        throw Error("Could not create a new task.")
      }
      const json: TaskSerialized = await response.json()
      const newTask = Task.deserialize(json)
      let allTasks = new Map(state.tasks)
      allTasks.set(newTask.id, newTask)
      commit("updateTasks", allTasks)
      return newTask
    }
  },
})
