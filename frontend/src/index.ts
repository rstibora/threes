import { createApp } from "vue"

import router from "src/routing/router"
import store from "src/state/store"
import { clickedOutside } from "src/utils/directives"

import Porch from "./components/Porch.vue"

const app = createApp(Porch)
app.use(router)
app.use(store)
app.directive("clicked-outside", clickedOutside)
app.mount("#app")
