import { State } from "@vue/runtime-core"
import { createStore } from "vuex"

export default createStore({
  state() {
      return {
          tasks: [] as Array<Object>,
      }
  },
  mutations: {
      fetchTasks(state: State) {
        fetch("http://127.0.0.1:8000/api/tasks")
        .then(response => response.json())
        .then(json => {
            for (let task of json) {
                state.tasks.push({
                    "name": task["name"],
                    "description": task["description"],
                })
            }
        })
      }
  }
})
