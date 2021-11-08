import { RouteLocationNormalized, RouteLocationRaw } from "vue-router"

import store from "src/state/store"
import { RouteNames } from "src/routing/routeNames"


export function taskExists(to: RouteLocationNormalized, from: RouteLocationNormalized): boolean | RouteLocationRaw {
    if (!store.getters.taskExists(parseInt(to.params.taskId as string))) {
        return { name: RouteNames.TASKS }
        }
    return true
}
