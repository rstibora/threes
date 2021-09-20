export interface SelectedTasksAction {
    getPreselected: () => Array<number>
    performAction: (selectedTasks: Array<number>) => Promise<void>
    readonly actionName: string
}

export interface TaskListConfiguration {
    action?: SelectedTasksAction
}
