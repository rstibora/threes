<template>
    <div class="card">
        <nav class="navbar">
            <button :disabled="!changeReviewButtonsEnabled.previous"  @click="changeSelectedReviewIndexBy(-1)" class="round">
                &lt;
            </button>

            <div>
                <router-link :to="({ name: 'review', params: { configurationId: selectedReviewBundle.review.configurationId,
                                                               reviewIndex: selectedReviewIndex,
                                                               ...((selectedReviewBundle.review.id !== undefined) && { reviewId: selectedReviewBundle.review.id })}})">
                    <strong>{{ selectedReviewBundle.reviewName }}</strong>
                </router-link>
                <br>{{ selectedReviewBundle.interval.start.toLocaleString() }} - {{ selectedReviewBundle.interval.end.toLocaleString() }}
            </div>

            <button :disabled="!changeReviewButtonsEnabled.next" @click="changeSelectedReviewIndexBy(1)" class="round">
                &gt;
            </button>
        </nav>
        <task-pill v-for="task of plannedTasks(selectedReviewBundle.review).values()" :key="task.id" :task="task"
                   :efforts="effortsPerTask(task, selectedReviewBundle.interval)"/>
        <task-pill v-for="[task, efforts] of tasksAndEffortsForInterval(selectedReviewBundle.interval, plannedTasks(selectedReviewBundle.review))" :key="task.id" :task="task"
                   :efforts="efforts"/>
    </div>
</template>

<script lang="ts">
import { DateTime, Interval } from "luxon"
import { defineComponent, PropType } from "vue"
import { mapGetters, mapState } from "vuex"

import TaskPill from "src/components/tasks/TaskPill.vue"

import { Actions } from "src/state/storeAccess"
import { State } from "src/state/store"

import { Session } from "src/state/session"
import { Review, NewReview } from "src/network/models/review"
import { ReviewConfiguration } from "src/network/models/reviewConfiguration"


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
        ...mapState({
            efforts: state => (state as State).efforts.efforts,
            reviews: state => (state as State).reviews.reviews,
            session: state => (state as State).session.session,
            tasks: state => (state as State).tasks.tasks
        }),
        ...mapGetters(["plannedTasks", "effortsPerTask", "tasksAndEffortsForInterval"]),
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

    components: {
        TaskPill,
    },

    created: async function() {
        this.$store.dispatch(Actions.FETCH_EFFORTS)
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
