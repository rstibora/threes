import { State } from "@vue/runtime-core"
import { createStore } from "vuex"

import { Session } from "src/state/session"
import { fetch_resource } from "src/network/fetch_resource"

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
    updateSession(state: State, payload) {
      state.session = payload.session
    }
  },
  actions: {
    async fetchTasks(context) {
      if (context.state.session == null) {
        const refreshResponse = await fetch_resource("POST", "/api/token/refresh/")
        const refreshResponseJson = await refreshResponse.json()
        context.commit("updateSession", {"session": new Session(refreshResponseJson["access"])})
      }

      if (context.state.session == null) {
        return
      }

      let response = await fetch_resource("GET", "/api/tasks/", context.state.session.accessJwt)
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
