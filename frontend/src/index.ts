import { createPinia } from "pinia"
import { createApp } from "vue"

import { RouteNames } from "src/routing/routeNames"
import router from "src/routing/router"
import { clickedOutside } from "src/utils/directives"
import Porch from "./components/Porch.vue"

import { prepareRxdbPlugin } from "src/state/piniaRxdb"
import { schema as tasksSchema } from "src/state/tasksStore"

const rxdbPlugin = await prepareRxdbPlugin({"tasks": { schema: tasksSchema }})

const app = createApp(Porch)
const pinia = createPinia()
pinia.use(rxdbPlugin)
app.use(pinia)
app.use(router)
app.directive("clicked-outside", clickedOutside)

app.config.globalProperties.RouteNames = RouteNames

app.mount("#app")
