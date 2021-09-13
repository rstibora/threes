import { Interval } from "luxon"
import { createStore } from "vuex"

import { MapById } from "src/utils/types"

import { Effort } from "src/network/models/effort"
import { Review, NewReview } from "src/network/models/review"
import { Task } from "src/network/models/task"

import { EffortsModule, State as EffortsState, Store as EffortsStore } from "src/state/modules/effortsModule"
import { ReviewsModule, State as ReviewsState, Store as ReviewsStore } from "src/state/modules/reviewsModule"
import { SessionModule, State as SessionState, Store as SessionStore } from "src/state/modules/sessionModule"
import { TasksModule, State as TasksState, Store as TasksStore } from "src/state/modules/tasksModule"


// TODO: typing of the store sucks, maybe can be improved as seen here: https://gist.github.com/soerenmartius/ad62ad59b991c99983a4e495bf6acb04,
// but it might not be worth it. Perhaps wait for vuex 5.

export type State = {
    efforts: EffortsState,
    reviews: ReviewsState,
    session: SessionState,
    tasks: TasksState,
}

export type Store = EffortsStore<Pick<State, "efforts">>
                    & ReviewsStore<Pick<State, "reviews">>
                    & SessionStore<Pick<State, "session">>
                    & TasksStore<Pick<State, "tasks">>

export default createStore({
    modules: {
        efforts: EffortsModule,
        reviews: ReviewsModule,
        session: SessionModule,
        tasks: TasksModule,
    },
    getters: {
        plannedTasks: (state: State) => (review: Review | NewReview): MapById<Task> => {
          /**
           * Returns tasks planned for the given review.
           */
            let plannedTasks = new Map()
            for (const task of state.tasks.tasks.values()) {
                if (review.plannedTasksIds.includes(task.id)) {
                    plannedTasks.set(task.id, task)
                }
            }
            return plannedTasks
        },
        effortsPerTask: (state: State) => (task: Task, interval?: Interval): MapById<Effort> => {
            /**
             * Returns all efforts for the given task, possibly limited to the given interval.
             */
            let efforts = new Map()
            for (const effort of state.efforts.efforts.values()) {
                if (effort.taskId !== task.id) {
                    continue
                }
                if (interval !== undefined && interval.intersection(effort.interval) == null) {
                    continue
                }
                efforts.set(effort.id, effort)
            }
            return efforts
        },
        tasksAndEffortsForInterval: (state, getters) => (interval: Interval, ignoreTasks?: MapById<Task>): Array<[Task, MapById<Effort>]> => {
            /**
             * Returns tasks that have an effort in the given interval. Also returns efforts per task for the interval.
             */
            let taskIdsToConsider = new Set(state.tasks.tasks.keys())
            if (ignoreTasks !== undefined) {
                for (const ignoreTaskId of ignoreTasks.keys()) {
                    taskIdsToConsider.delete(ignoreTaskId)
                }
            }

            let tasksAndEfforts = new Array()
            for (const taskId of taskIdsToConsider) {
                const taskEfforts = getters.effortsPerTask(state.tasks.tasks.get(taskId), interval)
                if (taskEfforts.size === 0) {
                    continue
                }
                tasksAndEfforts.push([state.tasks.tasks.get(taskId), taskEfforts])
            }
            return tasksAndEfforts
        }
    }
})
