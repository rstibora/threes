import { ReviewIdentification } from "src/network/models/review"


export interface SelectTasksForReview {
    reviewIdentification: ReviewIdentification
}

export interface TaskListConfiguration {
    action?: SelectTasksForReview
}
