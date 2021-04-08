import { createApp } from "vue"

import store from "./state/store"

import App from "./components/app_main.vue"

const app = createApp(App)
app.use(store)
app.mount("#app")
