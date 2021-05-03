import { State } from "@vue/runtime-core"
import { createStore } from "vuex"

import { Session } from "src/state/session"
import { fetchResource } from "src/network/fetchResource"

import { Task } from "src/network/models/task"
import { ReviewPeriodConfiguration } from "src/network/models/reviewPeriodConfiguration"

export default createStore({
  state() {
      return {
          tasks: [] as Array<Task>,
          reviewPeriodConfigurations: [] as Array<ReviewPeriodConfiguration>,
          reviews: [] as Array<Object>,
          session: undefined,
      }
  },
  mutations: {
    updateTasks(state: State, payload) {
        state.tasks = payload
    },
    updateReviewPeriodConfigurations(state: State, payload) {
      state.reviewPeriodConfigurations = payload
    },
    addTask(state: State, payload) {
      state.tasks.push(payload.task)
    },
    updateSession(state: State, payload: {session?: Session}) {
      state.session = payload.session
    }
  },
  actions: {
    async fetchAll(context, payload) {
      if (context.state.session == null) {
        const refreshResponse = await fetchResource("POST", "/api/token/refresh/")
        const refreshResponseJson = await refreshResponse.json()
        context.commit("updateSession", {"session": new Session(refreshResponseJson["access"])})
      }

      if (context.state.session == null) {
        return
      }

      let response = await fetchResource("GET", payload.apiPath, undefined, context.state.session.accessJwt)
      const responseJson = await response.json()

      let items = []
      for (let item of responseJson) {
          items.push(new payload.model(item))
      }
      context.commit(payload.mutation, items)
    },
  }
})
