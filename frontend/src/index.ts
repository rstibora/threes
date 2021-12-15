import { DateTime } from "luxon"
import { createApp } from "vue"

import { RouteNames } from "src/routing/routeNames"
import router from "src/routing/router"
import store from "src/state/store"
import { clickedOutside } from "src/utils/directives"
import { relativeDateTime } from "src/utils/dateTime"

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

app.config.globalProperties.RouteNames = RouteNames

app.mount("#app")
