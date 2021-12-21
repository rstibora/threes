import { Store } from "src/state/store"
import { Actions } from "src/state/storeAccess"

import { Review } from "src/network/models/review"

import { SelectedTasksAction } from "src/components/tasks/taskList"


export class TrackTasksAction implements SelectedTasksAction {
    private store: Store
    private reviewId: number
    readonly actionName: string
    readonly multipleSelection: boolean
    constructor(store: Store, reviewId: number) {
        this.store = store
        this.reviewId = reviewId
        this.actionName = "Track Selected Tasks"
        this.multipleSelection = true
    }

    getPreselected(): Array<number> {
        return (this.store.state.reviews.reviews.get(this.reviewId) as Review).plannedTasksIds
    }

    async performAction(selectedTasks: Array<number>): Promise<void> {
        const review = this.store.state.reviews.reviews.get(this.reviewId) as Review
        review.plannedTasksIds = selectedTasks
        await this.store.dispatch(Actions.UPDATE_REVIEW, { review })
    }
}
