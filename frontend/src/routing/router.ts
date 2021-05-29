import { createRouter, createWebHashHistory } from "vue-router"

import Dashboard from "src/components/Dashboard.vue"
import Tasks from "src/components/Tasks.vue"


const routes = [
    { path: "/dashboard", component: Dashboard },
    { path: "/tasks", component: Tasks },
]

export default createRouter({
    history: createWebHashHistory(),
    routes,
})
