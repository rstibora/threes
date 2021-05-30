import { createRouter, createWebHashHistory, RouteLocation } from "vue-router"

import Dashboard from "src/components/Dashboard.vue"
import TaskOverview from "src/components/tasks/TaskOverview.vue"
import Tasks from "src/components/Tasks.vue"


const routes = [
    { path: "/dashboard", component: Dashboard, name: "dashboard", alias: "/" },
    { path: "/tasks", component: Tasks, name: "tasks" },
    { path: "/tasks/:taskId", component: TaskOverview, name: "task",
      props: (route: any) => ({ taskId: parseInt(route.params.taskId) }) },

]

export default createRouter({
    history: createWebHashHistory(),
    routes,
})
