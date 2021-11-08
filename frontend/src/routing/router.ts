import { createRouter, createWebHashHistory, RouteLocation, RouteLocationNormalized, RouteRecordRaw, } from "vue-router"
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


export enum Routes {
    DASHBOARD = "DASHBOARD",
    EDIT_TASK = "EDIT_TASK",
    EFFORT = "EFFORT",
    NEW_REVIEW = "NEW_REVIEW",
    NEW_TASK = "NEW_TASK",
    REVIEW = "REVIEW",
    TASK = "TASK",
    TASKS = "TASKS",
}


const routes: Array<RouteRecordRaw> = [
    { path: "/dashboard", component: Dashboard, name: Routes.DASHBOARD, alias: "/" },

    { path: "/tasks", component: TaskList, name: Routes.TASKS,
      props: (route) => ({ configuration: parseTaskListConfiguration(route) }) },
    { path: "/tasks/:taskId", component: TaskOverview, name: Routes.TASK,
      props: (route) => ({ taskId: parseInt(route.params.taskId as string) }),
      beforeEnter: (to, _) => { return store.getters.taskExists(parseInt(to.params.taskId as string))}},
    { path: "/tasks/:taskId/edit", component: EditTask, name: Routes.EDIT_TASK,
      props: (route) => ({ taskId: parseInt(route.params.taskId as string )}),
      beforeEnter: (to, _) => {
        if (!store.getters.taskExists(parseInt(to.params.taskId as string))) {
          return { name: Routes.TASKS }
        }
        return true
      }},
    { path: "/tasks/new", component: EditTask, name: Routes.NEW_TASK},
    // TODO: the path does not feel right, perhaps it should be similar to /reviews/ logic instead.
    { path: "/tasks/:taskId/effort/:effortId?", component: EffortOverview, name: Routes.EFFORT,
      props: (route) => ({ taskId: parseInt(route.params.taskId as string),
                           effortId: route.params.effortId === undefined ? undefined : parseInt(route.params.effortId as string) })},

    { path: "/reviews/:configurationId/:reviewIndex", component: ReviewOverview, name: Routes.NEW_REVIEW,
      props: (route) => ({ reviewIdentification: { configurationId: parseInt(route.params.configurationId as string),
                                                   index: parseInt(route.params.reviewIndex as string) } as NewReviewIdentification })},
    { path: "/reviews/:reviewId", component: ReviewOverview, name: Routes.REVIEW,
      props: (route) => ({ reviewIdentification: { id: parseInt(route.params.reviewId as string) } as ExistingReviewIdentification})}
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
