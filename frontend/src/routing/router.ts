import { createRouter, createWebHashHistory, RouteLocation, RouteLocationNormalized, RouteRecordRaw, } from "vue-router"
import store from "src/state/store"

import Dashboard from "src/components/Dashboard.vue"
import EditEffort from "src/components/effort/EditEffort.vue"
import EditTask from "src/components/tasks/EditTask.vue"
import EffortOverview from "src/components/effort/EffortOverview.vue"
import ReviewOverview from "src/components/reviews/ReviewOverview.vue"
import { TrackTasksAction } from "src/components/reviews/trackTasksAction"
import { ExistingReviewIdentification, NewReviewIdentification } from "src/network/models/review"
import TaskList from "src/components/tasks/TaskList.vue"
import { TaskListConfiguration } from "src/components/tasks/taskList"
import TaskOverview from "src/components/tasks/TaskOverview.vue"

import { RouteNames } from "src/routing/routeNames"
import { effortExists, taskExists } from "src/routing/guards"


function parseTaskListConfiguration(route: RouteLocationNormalized): TaskListConfiguration | undefined {
    if (route.query?.action === "selectForReview") {
        if (route.query?.reviewId !== undefined) {
            return { action: new TrackTasksAction(store, parseInt(route.query.reviewId as string)) }
        }
    } 
    return undefined  
}


const routes: Array<RouteRecordRaw> = [
    { path: "/dashboard", component: Dashboard, name: RouteNames.DASHBOARD, alias: "/" },

    { path: "/tasks", component: TaskList, name: RouteNames.TASKS,
      props: (route) => ({ configuration: parseTaskListConfiguration(route) }) },
    { path: "/tasks/:taskId", component: TaskOverview, name: RouteNames.TASK,
      props: (route) => ({ taskId: parseInt(route.params.taskId as string) }),
      beforeEnter: taskExists},
    { path: "/tasks/:taskId/edit", component: EditTask, name: RouteNames.EDIT_TASK,
      props: (route) => ({ taskId: parseInt(route.params.taskId as string) }),
      beforeEnter: taskExists},
    { path: "/tasks/new", component: EditTask, name: RouteNames.NEW_TASK},

    { path: "/efforts/:taskId/:effortId", component: EffortOverview, name: RouteNames.EFFORT,
      props: (route) => ({ taskId: parseInt(route.params.taskId as string),
                           effortId: parseInt(route.params.effortId as string) }),
      beforeEnter: [taskExists, effortExists]},
    { path: "/efforts/:taskId/new", component: EditEffort, name: RouteNames.NEW_EFFORT,
      props: (route) => ({ taskId: parseInt(route.params.taskId as string) }),
      beforeEnter: [taskExists]},
    { path: "/efforts/:taskId/:effortId/edit", component: EditEffort, name: RouteNames.EDIT_EFFORT,
      props: (route) => ({ taskId: parseInt(route.params.taskId as string),
                           effortId: route.params.effortId === undefined ? undefined : parseInt(route.params.effortId as string) }),
      beforeEnter: [taskExists, effortExists]},

    { path: "/reviews/:configurationId/:reviewIndex", component: ReviewOverview, name: RouteNames.NEW_REVIEW,
      props: (route) => ({ reviewIdentification: { configurationId: parseInt(route.params.configurationId as string),
                                                   index: parseInt(route.params.reviewIndex as string) } as NewReviewIdentification })},
    { path: "/reviews/:reviewId", component: ReviewOverview, name: RouteNames.REVIEW,
      props: (route) => ({ reviewIdentification: { id: parseInt(route.params.reviewId as string) } as ExistingReviewIdentification})}
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
