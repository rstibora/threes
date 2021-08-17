<template>
    <div class="card">
        <nav class="navbar">
            <button :disabled="!changeReviewButtonsEnabled.previous"  @click="changeSelectedReviewIndexBy(-1)" class="round">
                &lt;
            </button>

            <div>
                <router-link :to="({ name: 'review', params: { configurationId: selectedReviewBundle.review.configurationId,
                                                               reviewIndex: selectedReviewIndex,
                                                               reviewId: selectedReviewBundle.review.id }})">
                    <strong>{{ selectedReviewBundle.reviewName }}</strong>
                </router-link>
                <br>{{ selectedReviewBundle.interval.start.toLocaleString() }} - {{ selectedReviewBundle.interval.end.toLocaleString() }}
            </div>

            <button :disabled="!changeReviewButtonsEnabled.next" @click="changeSelectedReviewIndexBy(1)" class="round">
                &gt;
            </button>
        </nav>
        <task-pill v-for="task in plannedTasks" :key="task.id" :task="task" :efforts="effortsPerTask.get(task.id)"/>
    </div>
</template>

<script lang="ts">
import { DateTime, Duration, Interval } from "luxon"
import { defineComponent, PropType } from "vue"
import { mapActions, mapState } from "vuex"

import TaskPill from "src/components/tasks/TaskPill.vue"

import { Effort } from "src/network/models/effort"
import { Review, NewReview } from "src/network/models/review"
import { ReviewConfiguration } from "src/network/models/reviewConfiguration"
import { Task } from "src/network/models/task"


interface ReviewBundle {
    /**
     * Bunch of data bundled together to avoid the need for many computed methods.
     */
    review: Review | NewReview,
    interval: Interval,
    reviewName: string,
}

interface ChangeReviewButtonsEnabled {
    previous: boolean,
    next: boolean,
}

export default defineComponent({
    props: {
        configuration: {
            type: Object as PropType<ReviewConfiguration>,
            required: true,
        }
    },

    data: function() {
        return {
            selectedReviewIndex: this.configuration.getReviewIndex(DateTime.now())
        }
    },

    computed: {
        ...mapState(["efforts", "reviews", "session", "tasks"]),
        reviewsByIndex(): Map<number, Review> {
            let reviewsByIndex = new Map<number, Review>()
            for (const review of this.reviews.values()) {
                if (review.configurationId == this.configuration.id) {
                    reviewsByIndex.set(review.index, review)
                }
            }
            return reviewsByIndex
        },
        selectedReviewBundle(): ReviewBundle {
            let review = new NewReview(this.configuration.id, this.selectedReviewIndex, [])
            if (this.reviewsByIndex.has(this.selectedReviewIndex)) {
                review = this.reviewsByIndex.get(this.selectedReviewIndex) as Review
            }
            return { review,
                     interval: this.configuration.getReviewInterval(review.index),
                     reviewName: this.configuration.getReviewName(review.index) } 
        },
        effortsPerTask(): Map<number, Array<Effort>> {
            let effortPerTask = new Map<number, Array<Effort>>()
            // Ensure there is at least an empty array for each task id.
            for (const task of this.plannedTasks) {
                if (!effortPerTask.has(task.id)) {
                    effortPerTask.set(task.id, new Array<Effort>())
                }
            }

            for (const effort of this.efforts.values() as Array<Effort>) {
                if (effort.interval.intersection(this.selectedReviewBundle.interval) !== null) {
                    effortPerTask.get(effort.taskId)?.push(effort)
                }
            }
            return effortPerTask
        },
        plannedTasks(): Array<Task> {
            let plannedTasks: Array<Task> = []
            for (const id of this.selectedReviewBundle.review.plannedTasksIds) {
                plannedTasks.push(this.tasks.get(id))
            }
            return plannedTasks
        },
        changeReviewButtonsEnabled(): ChangeReviewButtonsEnabled {
            return {
                previous: (this.configuration.getReviewInterval(this.selectedReviewIndex - 1).end.valueOf()
                           >= this.session.dateJoined.valueOf()),
                next: true,
            }
        },
    },

    methods: {
        ...mapActions(["fetchEfforts"]),
        changeSelectedReviewIndexBy(step: number) {
            this.selectedReviewIndex = this.selectedReviewIndex + step
        }
    },

    components: {
        TaskPill,
    },

    created: async function() {
        this.fetchEfforts()
    }
})
</script>

<style scoped lang="sass">
@use "src/styles/constants"
@use "src/styles/visual"

$margin: constants.$margin-small

.navbar
    display: flex
    flex-direction: row
    justify-content: space-between

.round
    border-radius: 50%
    width: 2.5em
    height: 2.5em

.card
    @include visual.rounded
    margin: $margin
    padding: .5em
    background-color: constants.$colour-background
    width: 100%
</style>