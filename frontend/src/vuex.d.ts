// vuex.d.ts
import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

import type { Session } from "src/state/session"

import { Task } from "src/network/models/task"

declare module '@vue/runtime-core' {
  // declare your own store states
  interface State {
    tasks: Array<Task>
    session?: Session
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}