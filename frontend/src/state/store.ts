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
          tasksSerialized: [] as Array<TaskSerialized>,
          reviewPeriodConfigurationsSerialized: [] as Array<ReviewPeriodConfigurationSerialized>,
          reviewPeriodsSerialized: [] as Array<ReviewPeriodSerialized>,
          session: undefined,
      }
  },
  getters: {
    tasks(state: State) {
      let tasks = new Array<Task>()
      for (let task of state.tasksSerialized) {
        tasks.push(new Task(task))
      }
      return tasks
    },
    reviewPeriodConfigurations(state: State) {
      let configurations = new Array<ReviewPeriodConfiguration>()
      for (let configuration of state.reviewPeriodConfigurationsSerialized) {
        configurations.push(new ReviewPeriodConfiguration(configuration))
      }
      return configurations
    },
    reviewPeriods(state: State, getters) {
      const configurations = getters.reviewPeriodConfigurations as Array<ReviewPeriodConfiguration>
      let reviews = new Array<ReviewPeriod>()
      for (let review of state.reviewPeriodsSerialized) {
        const configuration = configurations.find(configuration => configuration.id == review.configuration)
        if (configuration == null) {
          console.error(`Configuration (id ${review.configuration}) for task not found`)
        } else {
          reviews.push(new ReviewPeriod(review, configuration))
        }
      }
      return reviews
    }
  },
  mutations: {
    updateReviewPeriods(state: State, payload) {
      state.reviewPeriodsSerialized = payload
    },
    updateReviewPeriodConfigurations(state: State, payload) {
      state.reviewPeriodConfigurationsSerialized = payload
    },
    updateTasks(state: State, payload) {
      state.tasksSerialized = payload
    },
    addTask(state: State, payload) {
      // TODO: broken.
      state.tasksSerialized.push(payload.task)
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
          items.push(item)
      }
      context.commit(payload.mutation, items)
    },
  }
})
