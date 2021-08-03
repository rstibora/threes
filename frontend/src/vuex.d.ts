// vuex.d.ts
import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

import type { Session } from "src/state/session"
import type { MapById } from "src/state/store"

import { Effort } from "src/network/models/effort"
import { Review } from "src/network/models/review"
import { ReviewConfiguration } from "src/network/models/reviewConfiguration"
import { Task } from "src/network/models/task"
import { UserReviewConfiguration } from "src/network/models/userReviewConfiguration"

declare module '@vue/runtime-core' {
  // declare your own store states
  interface State {
    efforts: MapById<Effort> // Disregard English, acquire simplicity when dealing with units of effort.
    reviews: MapById<Review>
    reviewConfigurations: MapById<ReviewConfiguration>
    tasks: MapById<Task>
    userReviewConfigurations: MapById<UserReviewConfiguration>

    session?: Session
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}