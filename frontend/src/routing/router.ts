import { createRouter, createWebHashHistory, RouteLocationNormalized, RouteRecordRaw, } from "vue-router"
import store from "src/state/store"

import Dashboard from "src/components/Dashboard.vue"
import EditTask from "src/components/tasks/EditTask.vue"
import EffortOverview from "src/components/effort/EffortOverview.vue"
import ReviewOverview from "src/components/reviews/ReviewOverview.vue"
import { TrackTasksAction } from "src/components/reviews/trackTasksAction"
import { ExistingReviewIdentification, NewReviewIdentification } from "src/network/models/review"
import TaskList from "src/components/tasks/TaskList.vue"
import { TaskListConfiguration } from "src/components/tasks/taskList"
import TaskOverview from "src/components/tasks/TaskOverview.vue"


function parseTaskListConfiguration(route: RouteLocationNormalized): TaskListConfiguration | undefined {
    if (route.query?.action === "selectForReview") {
        if (route.query?.reviewId !== undefined) {
            return { action: new TrackTasksAction(store, parseInt(route.query.reviewId as string)) }
        }
    } 
    return undefined  
}


const routes: Array<RouteRecordRaw> = [
    { path: "/dashboard", component: Dashboard, name: "dashboard", alias: "/" },

    { path: "/tasks", component: TaskList, name: "tasks",
      props: (route) => ({ configuration: parseTaskListConfiguration(route) }) },
    { path: "/tasks/:taskId", component: TaskOverview, name: "task",
      props: (route) => ({ taskId: parseInt(route.params.taskId as string) }) },
    { path: "/tasks/:taskId/edit", component: EditTask, name: "editTask",
      props: (route) => ({ taskId: parseInt(route.params.taskId as string )})},
    { path: "/tasks/new", component: EditTask, name: "newTask"},
    // TODO: the path does not feel right, perhaps it should be similar to /reviews/ logic instead.
    { path: "/tasks/:taskId/effort/:effortId?", component: EffortOverview, name: "effort",
      props: (route) => ({ taskId: parseInt(route.params.taskId as string),
                           effortId: route.params.effortId === undefined ? undefined : parseInt(route.params.effortId as string) })},

    { path: "/reviews/:configurationId/:reviewIndex", component: ReviewOverview, name: "newReview",
      props: (route) => ({ reviewIdentification: { configurationId: parseInt(route.params.configurationId as string),
                                                   index: parseInt(route.params.reviewIndex as string) } as NewReviewIdentification })},
    { path: "/reviews/:reviewId", component: ReviewOverview, name: "review",
      props: (route) => ({ reviewIdentification: { id: parseInt(route.params.reviewId as string) } as ExistingReviewIdentification})}
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
