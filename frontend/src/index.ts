import { createApp } from "vue"

import store from "./state/store"

import Porch from "./components/Porch.vue"

const app = createApp(Porch)
app.use(store)
app.mount("#app")
