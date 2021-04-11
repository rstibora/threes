import { createApp } from "vue"

import createStore from "./state/store"

import App from "./components/app_main.vue"

const app = createApp(App)
app.use(createStore)
app.mount("#app")
