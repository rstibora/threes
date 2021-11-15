import { RouteLocationNormalized, RouteLocationRaw } from "vue-router"

import store from "src/state/store"
import { Actions } from "src/state/storeAccess"
import { RouteNames } from "src/routing/routeNames"


export async function fetchAllData(to: RouteLocationNormalized, from: RouteLocationNormalized): Promise<boolean> {
    const fetchResults = await Promise.all([
        store.dispatch(Actions.FETCH_TASKS),
        store.dispatch(Actions.FETCH_REVIEW_CONFIGURATIONS),
        store.dispatch(Actions.FETCH_USER_REVIEW_CONFIGURATIONS),
        store.dispatch(Actions.FETCH_REVIEWS),
        store.dispatch(Actions.FETCH_EFFORTS),
    ])
    return true
}


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
