// vuex.d.ts
import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

import type { Session } from "src/state/session"

import { ReviewPeriodConfiguration } from './network/models/ReviewPeriodConfiguration'
import { Task } from "src/network/models/task"

declare module '@vue/runtime-core' {
  // declare your own store states
  interface State {
    tasks: Array<Task>
    reviewPeriodConfigurations: Array<ReviewPeriodConfiguration>
    session?: Session
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}