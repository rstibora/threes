// vuex.d.ts
import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

import type { Session } from "src/state/session"

import { Effort } from "src/network/models/effort"
import { ReviewPeriod } from 'src/network/models/reviewPeriod'
import { ReviewPeriodConfiguration } from "src/network/models/reviewPeriodConfiguration"
import { Task } from "src/network/models/task"

declare module '@vue/runtime-core' {
  // declare your own store states
  interface State {
    reviewPeriods: Map<number, ReviewPeriod>
    reviewPeriodConfigurations: Map<number, ReviewPeriodConfiguration>
    tasks: Map<number, Task>
    efforts: Map<number, Effort> // Disregard English, acquire simplicity when dealing with units of effort.

    session?: Session
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}