import { DateTime } from "luxon"
import { createApp } from "vue"

import router from "src/routing/router"
import store from "src/state/store"
import { clickedOutside } from "src/utils/directives"
import { relativeDateTime } from "./utils/relativeDateTime"

import Porch from "./components/Porch.vue"

const app = createApp(Porch)
app.use(router)
app.use(store)
// TODO: no longer needed?
app.directive("clicked-outside", clickedOutside)
app.mixin({ methods: {
    relativeDateTime(datetime: DateTime): string {
        return relativeDateTime(datetime)
    }
}})
app.mount("#app")
