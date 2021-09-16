import { createRouter, createWebHashHistory, RouteLocationNormalized, RouteRecordRaw } from "vue-router"

import Dashboard from "src/components/Dashboard.vue"
import EffortOverview from "src/components/effort/EffortOverview.vue"
import ReviewOverview from "src/components/reviews/ReviewOverview.vue"
import TaskList from "src/components/tasks/TaskList.vue"
import { TaskListConfiguration, SelectForReviewAction } from "src/components/tasks/taskList"
import TaskOverview from "src/components/tasks/TaskOverview.vue"


function getTaskListProps(route: RouteLocationNormalized): TaskListConfiguration | undefined {
    if (route.query?.selectForReview !== null) {
        return { action: { reviewId: parseInt(route.query.selectForReview as string) }}
    }
    return undefined
}


const routes: Array<RouteRecordRaw> = [
    { path: "/dashboard", component: Dashboard, name: "dashboard", alias: "/" },
    { path: "/tasks", component: TaskList, name: "tasks",
      props: (route) => getTaskListProps(route) },
    { path: "/tasks/:taskId", component: TaskOverview, name: "task",
      props: (route) => ({ taskId: parseInt(route.params.taskId as string) }) },
    { path: "/tasks/new", component: TaskOverview, name: "newTask"},
    { path: "/tasks/:taskId/effort/:effortId?", component: EffortOverview, name: "effort",
      props: (route) => ({ taskId: parseInt(route.params.taskId as string),
                                effortId: route.params.effortId === undefined ? undefined : parseInt(route.params.effortId as string) })},
    { path: "/reviews/:configurationId/:reviewIndex/:reviewId?", component: ReviewOverview, name: "review",
      props: (route) => ({ configurationId: parseInt(route.params.configurationId as string),
                                reviewIndex: parseInt(route.params.reviewIndex as string),
                                reviewId: route.params.reviewId === undefined ? undefined : parseInt(route.params.reviewId as string) })}

]

export default createRouter({
    history: createWebHashHistory(),
    routes,
})
