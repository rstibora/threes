// vuex.d.ts
import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

import type { Session } from "src/state/session"

declare module '@vue/runtime-core' {
  // declare your own store states
  interface State {
    tasks: Array<Object>
    session?: Session
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}