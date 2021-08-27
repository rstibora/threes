// vuex.d.ts
import { ComponentCustomProperties } from 'vue'
import { Store } from "vuex"

import { State as EffortsState, Store as EffortsStore } from "src/state/modules/effortsModule"
import { State as ReviewsState, Store as ReviewsStore } from "src/state/modules/reviewsModule"
import { State as SessionState, Store as SessionStore } from "src/state/modules/sessionModule"
import { State as TasksState, Store as TasksStore } from "src/state/modules/tasksModule"

type State = {
    efforts: EffortsState,
    reviews: ReviewsState,
    session: SessionState,
    tasks: TasksState,
}

// type Store = EffortsStore<Pick<State, "efforts">>
//              & ReviewsStore<Pick<State, "reviews">>
//              & SessionStore<Pick<State, "session">>
//              & TasksStore<Pick<State, "tasks">>

declare module '@vue/runtime-core' {
    // provide typings for `this.$store`
    interface ComponentCustomProperties {
        $store: Store<State>
    }
}
