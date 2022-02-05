import { Router } from "vue-router"

import { Review } from "src/network/models/review"
import { useReviewsStore } from "src/state/reviewsStore"

import { SelectedTasksAction } from "src/components/tasks/taskList"


export class TrackTasksAction implements SelectedTasksAction {
    private reviewId: number
    readonly actionName: string
    readonly allowMultiple: boolean
    readonly allowEmpty: boolean
    constructor(reviewId: number) {
        this.reviewId = reviewId
        this.actionName = "Track Selected Tasks"
        this.allowMultiple = true
        this.allowEmpty = true
    }

    getPreselected(): Array<number> {
        return (useReviewsStore().reviews.get(this.reviewId) as Review).plannedTasksIds
    }

    async performAction(selectedTasks: Array<number>, router: Router): Promise<void> {
        const review = useReviewsStore().reviews.get(this.reviewId) as Review
        review.plannedTasksIds = selectedTasks
        await useReviewsStore().updateReview(review)
        router.back()
    }
}
