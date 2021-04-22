// @ts-ignore: development dependency, will be removed later.
import { createApp } from "vue"

import createStore from "./state/store"

import Porch from "./components/Porch.vue"

const app = createApp(Porch)
app.use(createStore)
app.mount("#app")
