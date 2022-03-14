import { Interval } from "luxon"
import { defineStore } from "pinia"

import { Effort } from "src/network/models/effort"
import { NewReview } from "src/network/models/review"
import { deserializeTask, NewTask, Task } from "src/network/models/task"
import { createItem, deleteItem, getExistingItem, getItems, updateItem } from "src/state/common"
import { MapById } from "src/utils/types"

import { useEffortsStore } from "src/state/effortsStore"


export const schema =  {
  "title": "tasks schmea",
  "version": 0,
  "primaryKey": "id",
  "type": "object",
  "properties": {
    "id": {
      "type": "number"
    },
    "name": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "created": {
      "type": "string"
    }
  }
}

export const useTasksStore = defineStore("tasks", {
  state: () => {
    return {
      tasks: new Map<number, Task>(),
    }
  },
  getters: {
    getExistingTask: (state) => (taskId: number) => getExistingItem(state.tasks, taskId),
    taskExists: (state) => (taskId: number) => state.tasks.has(taskId),
    plannedTasks: (state) => (review: NewReview): MapById<Task> => {
      /**
       * Returns tasks planned for the given review.
       */
       const plannedTasks = new Map()
       for (const task of state.tasks.values()) {
         if (review.plannedTasksIds.includes(task.id)) {
           plannedTasks.set(task.id, task)
         }
       }
       return plannedTasks
    },
    tasksAndEffortsForInterval(state): (interval: Interval, ignoreTasks?: MapById<Task>) => Array<[Task, MapById<Effort>]> {
      /**
       * Returns tasks that have an effort in the given interval. Also returns efforts per task for the interval.
       */
      return (interval: Interval, ignoreTasks?: MapById<Task>): Array<[Task, MapById<Effort>]> => {
        const taskIdsToConsider = new Set(state.tasks.keys())
        if (ignoreTasks !== undefined) {
          for (const ignoreTaskId of ignoreTasks.keys()) {
            taskIdsToConsider.delete(ignoreTaskId)
          }
        }

        const tasksAndEfforts: [Task, MapById<Effort>][] = []
        for (const taskId of taskIdsToConsider) {
          const taskEfforts = useEffortsStore().effortsPerTask(this.getExistingTask(taskId), interval)
          if (taskEfforts.size === 0) {
            continue
          }
          tasksAndEfforts.push([this.getExistingTask(taskId), taskEfforts])
        }
        return tasksAndEfforts
      }
    },
  },
  actions: {
    async createTask(task: NewTask): Promise<Readonly<Task>> {
      return createItem(this.tasks, task, deserializeTask, "/api/tasks/")
    },
    async updateTask(task: Task): Promise<Readonly<Task>> {
      return updateItem(this.tasks, task, deserializeTask, `/api/tasks/${task.id}/`)
    },
    async deleteTask(task: Task): Promise<void> {
      return deleteItem(this.tasks, task, `/api/tasks/${task.id}/`)
    },
    async fetchTasks(): Promise<void> {
      getItems(this.tasks, deserializeTask, "/api/tasks/")
    },
  },
  schemaName: "tasks"
})
