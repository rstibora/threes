import { State } from "@vue/runtime-core"
import { createStore } from "vuex"

export default createStore({
  state() {
      return {
          tasks: [] as Array<Object>,
      }
  },
  mutations: {
    updateTasks(state: State, payload) {
        state.tasks = payload.tasks
    }
  },
  actions: {
      async fetchTasks(context) {
        const response = await fetch("http://127.0.0.1:8000/api/tasks")
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
