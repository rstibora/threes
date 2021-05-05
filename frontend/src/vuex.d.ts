// vuex.d.ts
import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

import type { Session } from "src/state/session"

import { ReviewPeriodSerialized } from './network/models/reviewPeriod'
import { ReviewPeriodConfigurationSerialized } from "src/network/models/reviewPeriodConfiguration"
import { TaskSerialized } from "src/network/models/task"

declare module '@vue/runtime-core' {
  // declare your own store states
  interface State {
    reviewPeriodsSerialized: Array<ReviewPeriodSerialized>
    reviewPeriodConfigurationsSerialized: Array<ReviewPeriodConfigurationSerialized>
    tasksSerialized: Array<TaskSerialized>

    session?: Session
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}