import { createRouter, createWebHashHistory } from "vue-router"

import Dashboard from "src/components/Dashboard.vue"
import Tasks from "src/components/Tasks.vue"


const routes = [
    { path: "/dashboard", component: Dashboard, name: "dashboard" },
    { path: "/tasks", component: Tasks, name: "tasks" },
]

export default createRouter({
    history: createWebHashHistory(),
    routes,
})
