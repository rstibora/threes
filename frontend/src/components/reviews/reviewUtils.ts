import { Task } from "src/network/models/task"
import { Review, NewReview } from "src/network/models/review"
import { ReviewConfiguration } from "src/network/models/reviewConfiguration"

import { MapById } from "src/state/store"


interface FilteredTasks {
    planned: MapById<Task>
}

export function filterTasks(tasks: MapById<Task>, configuration: ReviewConfiguration,
                            review: Review | NewReview): FilteredTasks {
    let filteredTasks = new Map()
    for (const task of tasks.values()) {
        if (review.plannedTasksIds.includes(task.id)) {
            filteredTasks.set(task.id, task)
        }
    }
    return { planned: filteredTasks }
}
