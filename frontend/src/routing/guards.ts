import { RouteLocationNormalized, RouteLocationRaw } from "vue-router"

import { useEffortsStore } from "src/state/effortsStore"
import { useReviewConfigurationsStore } from "src/state/reviewConfigurationsStore"
import { useReviewsStore } from "src/state/reviewsStore"
import { useTasksStore } from "src/state/tasksStore"
import { RouteNames } from "src/routing/routeNames"


export async function fetchAllData(to: RouteLocationNormalized, from: RouteLocationNormalized): Promise<boolean> {
    await Promise.all([
        useTasksStore().fetchTasks(),
        useReviewConfigurationsStore().fetchReviewConfigurations(),
        useReviewConfigurationsStore().fetchUserReviewConfigurations(),
        useReviewsStore().fetchReviews(),
        useEffortsStore().fetchEfforts(),
    ])
    return true
}


export function taskExists(to: RouteLocationNormalized, from: RouteLocationNormalized): boolean | RouteLocationRaw {
    if (!useTasksStore().taskExists(parseInt(to.params.taskId as string))) {
        if (from.name === RouteNames.TASKS) {
            return { name: RouteNames.TASKS }
        }
        return { name: RouteNames.DASHBOARD }
    }
    return true
}

export function effortExists(to: RouteLocationNormalized, from: RouteLocationNormalized): boolean | RouteLocationRaw {
    if (!useEffortsStore().effortExists(parseInt(to.params.effortId as string))) {
        return { name: RouteNames.TASK, params: { taskId: parseInt(to.params.taskId as string)}}
    }
    return true
}
