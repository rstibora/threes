import { RouteLocationNormalized, RouteLocationRaw } from "vue-router"

import store from "src/state/store"
import { RouteNames } from "src/routing/routeNames"


export function taskExists(to: RouteLocationNormalized, from: RouteLocationNormalized): boolean | RouteLocationRaw {
    if (!store.getters.taskExists(parseInt(to.params.taskId as string))) {
        if (from.name === RouteNames.TASKS) {
            return { name: RouteNames.TASKS }
        }
        return { name: RouteNames.DASHBOARD }
    }
    return true
}

export function effortExists(to: RouteLocationNormalized, from: RouteLocationNormalized): boolean | RouteLocationRaw {
    if (!store.getters.effortExists(parseInt(to.params.effortId as string))) {
        return { name: RouteNames.TASK, params: { taskId: parseInt(to.params.taskId as string)}}
    }
    return true
}
