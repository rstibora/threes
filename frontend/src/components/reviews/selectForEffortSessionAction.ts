import { Router } from "vue-router"

import { SelectedTasksAction } from "src/components/tasks/taskList"
import { RouteNames } from "src/routing/routeNames"


export class SelectForEffortSessionAction implements SelectedTasksAction {
    readonly actionName: string
    readonly allowMultiple: boolean
    readonly allowEmpty: boolean
    selectedTasks: Array<number>
    constructor(selectedTask?: number) {
        this.selectedTasks = selectedTask ? [selectedTask] : []
        this.actionName = "Select task"
        this.allowMultiple = false
        this.allowEmpty = false
    }

    getPreselected(): Array<number> {
        return this.selectedTasks
    }

    async performAction(selectedTasks: Array<number>, router: Router): Promise<void> {
        router.push({ name: RouteNames.EFFORT_SESSION, params: { taskId: selectedTasks[0] } })
    }
}
