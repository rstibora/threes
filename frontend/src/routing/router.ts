import { createRouter, createWebHashHistory } from "vue-router"

import Dashboard from "src/components/Dashboard.vue"
import TaskOverview from "src/components/tasks/TaskOverview.vue"
import Tasks from "src/components/Tasks.vue"


const routes = [
    { path: "/dashboard", component: Dashboard, name: "dashboard", alias: "/" },
    { path: "/tasks", component: Tasks, name: "tasks" },
    { path: "/tasks/:taskId", component: TaskOverview, name: "task" },
]

export default createRouter({
    history: createWebHashHistory(),
    routes,
})
