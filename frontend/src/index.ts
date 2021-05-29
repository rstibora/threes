import { createApp } from "vue"

import router from "./routing/router"
import store from "./state/store"

import Porch from "./components/Porch.vue"

const app = createApp(Porch)
app.use(router)
app.use(store)
app.mount("#app")
