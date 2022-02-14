<template>
    <div class="card">
        <nav class="navbar">
            <button
                :disabled="!changeReviewButtonsEnabled.previous"
                class="round"
                @click="changeSelectedReviewIndexBy(-1)"
            >
                &lt;
            </button>

            <div>
                <router-link
                    :to="(
                        selectedReviewBundle.review.id === undefined ?
                        { name: RouteNames.NEW_REVIEW, params: { configurationId: selectedReviewBundle.review.configurationId,
                                                                 reviewIndex: selectedReviewIndex }} :
                        { name: RouteNames.REVIEW, params: { reviewId: selectedReviewBundle.review.id }})"
                    >
                    <strong>{{ selectedReviewBundle.reviewName }}</strong>
                </router-link>
                <br>{{ reviewIntervalString }}
            </div>

            <button
                :disabled="!changeReviewButtonsEnabled.next"
                class="round"
                @click="changeSelectedReviewIndexBy(1)"
            >
                &gt;
            </button>
        </nav>
        <task-pill
            v-for="task of plannedTasks(selectedReviewBundle.review).values()"
            :key="task.id"
            :task="task"
            :efforts="effortsPerTask(task, selectedReviewBundle.interval)"
        />
        <task-pill
            v-for="[task, efforts] of tasksAndEffortsForInterval(selectedReviewBundle.interval, plannedTasks(selectedReviewBundle.review))"
            :key="task.id" 
            :task="task"
            :configuration="{ showTotalEffortTime: true }"
            :efforts="efforts"
        />
    </div>
</template>

<script lang="ts">
import { DateTime, Interval } from "luxon"
import { defineComponent, PropType } from "vue"
import { mapState } from "pinia"

import TaskPill from "src/components/tasks/TaskPill.vue"

import { displayIntervalEnd } from "src/utils/dateTime"

import { Session } from "src/state/session"
import { Review, NewReview } from "src/network/models/review"
import { ReviewConfiguration } from "src/network/models/reviewConfiguration"
import { useEffortsStore } from "src/state/effortsStore"
import { useReviewsStore } from "src/state/reviewsStore"
import { useSessionStore } from "src/state/sessionStore"
import { useTasksStore } from "src/state/tasksStore"


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
    components: {
        TaskPill,
    },
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
        ...mapState(useEffortsStore, ["efforts", "effortsPerTask"]),
        ...mapState(useReviewsStore, ["reviews"]),
        ...mapState(useSessionStore, ["session"]),
        ...mapState(useTasksStore, ["tasks", "plannedTasks", "tasksAndEffortsForInterval"]),
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
        reviewIntervalString(): string {
            const start = this.selectedReviewBundle.interval.start.toLocaleString()
            const end = displayIntervalEnd(this.selectedReviewBundle.interval.end).toLocaleString()
            return `${start} - ${end}`
        },
        changeReviewButtonsEnabled(): ChangeReviewButtonsEnabled {
            const session = this.session as Session
            return {
                previous: (this.configuration.getReviewInterval(this.selectedReviewIndex - 1).end.valueOf()
                           >= session.dateJoined.valueOf()),
                next: true,
            }
        },
    },
    methods: {
        changeSelectedReviewIndexBy(step: number) {
            this.selectedReviewIndex = this.selectedReviewIndex + step
        }
    },
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
