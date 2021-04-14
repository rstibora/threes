import { State } from "@vue/runtime-core"
import { createStore } from "vuex"

import { Session } from "src/state/session"
import { fetch_resource } from "src/network/fetch_api"

export default createStore({
  state() {
      return {
          tasks: [] as Array<Object>,
          session: new Session(),
      }
  },
  mutations: {
    updateTasks(state: State, payload) {
        state.tasks = payload.tasks
    },
    updateAccessToken(state: State, payload) {
      state.session.access_jwt = payload.access
    }
  },
  actions: {
      async fetchTasks(context) {
        let response = await fetch_resource("GET", "/api/tasks/", context.state.session.access_jwt)
        if (response.status == 401) {
          const refresh_response = await fetch_resource("POST", "/api/token/refresh/")
          const refresh_response_json = await refresh_response.json()
          context.commit("updateAccessToken", {"access": refresh_response_json["access"]})
          response = await fetch_resource("GET", "/api/tasks/", context.state.session.access_jwt)
        }
        const json = await response.json()

        let tasks = []
        for (let task of json) {
            tasks.push({
                "name": task["name"],
                "description": task["description"],
            })
        }
        context.commit("updateTasks", {"tasks": tasks})
      }
  }
})
