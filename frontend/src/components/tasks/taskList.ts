import { Router } from "vue-router"

export interface SelectedTasksAction {
  getPreselected: () => Array<number>
  performAction: (selectedTasks: Array<number>, router: Router) => Promise<void>
  readonly actionName: string
  readonly allowMultiple: boolean
  readonly allowEmpty: boolean
}

export interface TaskListConfiguration {
  action?: SelectedTasksAction
}
