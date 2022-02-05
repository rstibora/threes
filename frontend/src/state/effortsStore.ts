import { Interval } from "luxon"
import { defineStore } from "pinia"

import { deserializeEffort, NewEffort, Effort } from "src/network/models/effort"
import { Task } from "src/network/models/task"
import { createItem, deleteItem, getItems, updateItem } from "src/state/common"
import { MapById } from "src/utils/types"


export const useEffortsStore = defineStore("efforts", {
  state: () => {
    return {
      efforts: new Map<number, Effort>(),
    }
  },
  getters: {
    effortExists: (state) => (effortId: number) => state.efforts.has(effortId),
    effortsPerTask: (state) => (task: Task, interval?: Interval): MapById<Effort> => {
      /**
       * Returns all efforts for the given task, possibly limited to the given interval.
       */
      const efforts = new Map()
      for (const effort of state.efforts.values()) {
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
  },
  actions: {
    async createEffort(effort: NewEffort): Promise<Readonly<Effort>> {
      return createItem(this.efforts, effort, deserializeEffort, "/api/efforts/")
    },
    async updateEffort(effort: Effort): Promise<Readonly<Effort>> {
      return updateItem(this.efforts, effort, deserializeEffort, `/api/efforts/${effort.id}/`)
    },
    async deleteEffort(effort: Effort): Promise<void> {
      return deleteItem(this.efforts, effort, `/api/efforts/${effort.id}/`)
    },
    async fetchEfforts(): Promise<void> {
      getItems(this.efforts, deserializeEffort, "/api/efforts/")
    },
  }
})