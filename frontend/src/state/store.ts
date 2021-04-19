import { State } from "@vue/runtime-core"
import { createStore } from "vuex"

import { Session } from "src/state/session"
import { fetchResource } from "src/network/fetchResource"

export default createStore({
  state() {
      return {
          tasks: [] as Array<Object>,
          session: undefined,
      }
  },
  mutations: {
    updateTasks(state: State, payload) {
        state.tasks = payload.tasks
    },
    addTask(state: State, payload) {
      state.tasks.push(payload.task)
    },
    updateSession(state: State, payload: {session?: Session}) {
      state.session = payload.session
    }
  },
  actions: {
    async fetchTasks(context) {
      if (context.state.session == null) {
        const refreshResponse = await fetchResource("POST", "/api/token/refresh/")
        const refreshResponseJson = await refreshResponse.json()
        context.commit("updateSession", {"session": new Session(refreshResponseJson["access"])})
      }

      if (context.state.session == null) {
        return
      }

      let response = await fetchResource("GET", "/api/tasks/", undefined, context.state.session.accessJwt)
      const responseJson = await response.json()

      let tasks = []
      for (let task of responseJson) {
          tasks.push({
              "name": task["name"],
              "description": task["description"],
          })
      }
      context.commit("updateTasks", {"tasks": tasks})
    }
  }
})
