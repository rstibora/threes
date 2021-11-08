import { DateTime } from "luxon"
import { createApp } from "vue"

import router, { Routes } from "src/routing/router"
import store from "src/state/store"
import { clickedOutside } from "src/utils/directives"
import { relativeDateTime } from "./utils/relativeDateTime"

import Porch from "./components/Porch.vue"

const app = createApp(Porch)
app.use(router)
app.use(store)
app.directive("clicked-outside", clickedOutside)
app.mixin({ methods: {
    relativeDateTime(datetime: DateTime): string {
        return relativeDateTime(datetime)
    }
}})

app.config.globalProperties.Routes = Routes

app.mount("#app")
