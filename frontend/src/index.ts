import { createPinia } from "pinia"
import { createApp } from "vue"

import { RouteNames } from "src/routing/routeNames"
import router from "src/routing/router"
import { clickedOutside } from "src/utils/directives"

import Porch from "./components/Porch.vue"

const app = createApp(Porch)
app.use(createPinia())
app.use(router)
app.directive("clicked-outside", clickedOutside)

app.config.globalProperties.RouteNames = RouteNames

app.mount("#app")
