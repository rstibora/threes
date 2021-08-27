import { Module, Store as VuexStore } from "vuex"

import { MapById } from "src/utils/types"
import { Task, TaskSerialized, NewTask } from "src/network/models/task"

import { Actions, Mutations } from "src/state/storeAccess"

import { updateOrDeleteInMap } from "src/state/modules/moduleUtils"


export type State = {
    tasks: MapById<Task> 
}

export type Store<S = State> = VuexStore<S>

export const TasksModule: Module<State, any> = {
    state: () => ({
        tasks: new Map<number, Task>(),
    }),
    mutations: {
        [Mutations.UPDATE_TASKS] ( state, payload: { tasks: MapById<Task | undefined> }) {
            updateOrDeleteInMap(state.tasks, payload.tasks)
        }
    },
    actions: {
        async [Actions.CREATE_TASK] ({ dispatch, commit }, payload: { task: NewTask }) {
            // TODO: handle failure cases.
            const response: Response = await dispatch(
                Actions.FETCH_RESOURCE, { method: "POST", apiPath: `/api/tasks/`,
                                          data: payload.task.serialize() })
            const taskSerialized = await response.json()
            const task = Task.deserialize(taskSerialized)
            commit(Mutations.UPDATE_TASKS, new Map([[task.id, task]]))
        },
        async [Actions.UPDATE_TASKS] ({ dispatch, commit }, payload: { task: Task }): Promise<Task> {
            // TODO: handle failure cases.
            const response: Response = await dispatch(
                Actions.FETCH_RESOURCE, { method: "PUT", apiPath: `/api/tasks/${payload.task.id}/`,
                                          data: payload.task.serialize() })
            commit(Mutations.UPDATE_TASKS, new Map([[payload.task.id, payload.task]]))
            return payload.task
        },
        async [Actions.FETCH_TASKS] ({ dispatch, commit }) {
            // TODO: handle failure cases.
            const response: Response = await dispatch(
                Actions.FETCH_RESOURCE, { method: "GET", apiPath: "/api/tasks" })
            const tasksSerialized: Array<TaskSerialized> = await response.json()
            let tasks = new Map()
            for (const taskSerialized of tasksSerialized) {
                const task = Task.deserialize(taskSerialized)
                tasks.set(task.id, task)
            }
            commit(Mutations.UPDATE_TASKS, { tasks })
        }
    }
}
