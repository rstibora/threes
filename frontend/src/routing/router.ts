import { createRouter, createWebHashHistory, RouteLocation } from "vue-router"

import Dashboard from "src/components/Dashboard.vue"
import EffortOverview from "src/components/effort/EffortOverview.vue"
import ReviewOverview from "src/components/reviews/ReviewOverview.vue"
import TaskOverview from "src/components/tasks/TaskOverview.vue"
import Tasks from "src/components/Tasks.vue"


const routes = [
    { path: "/dashboard", component: Dashboard, name: "dashboard", alias: "/" },
    { path: "/tasks", component: Tasks, name: "tasks" },
    { path: "/tasks/:taskId", component: TaskOverview, name: "task",
      props: (route: any) => ({ taskId: parseInt(route.params.taskId) }) },
    { path: "/tasks/new", component: TaskOverview, name: "newTask"},
    { path: "/tasks/:taskId/effort/:effortId?", component: EffortOverview, name: "effort",
      props: (route: any) => ({ taskId: parseInt(route.params.taskId),
                                effortId: route.params.effortId === undefined ? undefined : parseInt(route.params.effortId) })},
    { path: "/reviews/:configurationId/:reviewIndex/:reviewId?", component: ReviewOverview, name: "review",
      props: (route: any) => ({ configurationId: parseInt(route.params.configurationId),
                                reviewIndex: parseInt(route.params.reviewIndex),
                                reviewId: route.params.reviewId === undefined ? undefined : parseInt(route.params.reviewId) })}

]

export default createRouter({
    history: createWebHashHistory(),
    routes,
})
