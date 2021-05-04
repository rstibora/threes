// vuex.d.ts
import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

import type { Session } from "src/state/session"

import { ReviewPeriod } from './network/models/reviewPeriod'
import { ReviewPeriodConfiguration } from "src/network/models/reviewPeriodConfiguration"
import { Task } from "src/network/models/task"

declare module '@vue/runtime-core' {
  // declare your own store states
  interface State {
    reviewPeriods: Array<ReviewPeriod>
    reviewPeriodConfigurations: Array<ReviewPeriodConfiguration>
    tasks: Array<Task>

    session?: Session
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}