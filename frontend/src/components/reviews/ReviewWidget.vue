<template>
    <div class="card">
        <nav class="navbar">
            <button :disabled="previousButtonDisabled"  @click="changeSelectedReviewIndexBy(-1)" class="round">
                &lt;
            </button>
            <div v-if="selectedReviewBundle != null">
                <strong>{{ reviewPeriodName != null ? reviewPeriodName : "Create your first Review Period" }}</strong>
                <br>{{ selectedReviewInterval[0].toLocaleString() }} - {{ selectedReviewInterval[1].toLocaleString() }}
            </div>
            <p v-else>Create your first Review Period</p>
            <button :disabled="nextButtonDisabled" @click="changeSelectedReviewIndexBy(1)" class="round">
                &gt;
            </button>
        </nav>
        <task-pill v-for="task in plannedTasks" :key="task.id" :task="task" :efforts="effortPerTaskForSelectedReview.get(task.id)"/>
    </div>
</template>

<script lang="ts">
import { DateTime, Duration, Interval } from "luxon"
import { defineComponent, PropType } from "vue"
import { mapActions, mapState } from "vuex"

import TaskPill from "src/components/tasks/TaskPill.vue"

import { Effort } from "src/network/models/effort"
import { Review } from "src/network/models/review"
import { ReviewConfiguration } from "src/network/models/reviewConfiguration"
import { Task } from "src/network/models/task"


interface ReviewBundle {
    /**
     * Bunch of data bundled together to avoid the need for many computed methods.
     */
    review: Review,
    interval: Interval,
    reviewName: string,
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
            selectedReviewIndex: 0,
        }
    },

    computed: {
        ...mapState(["efforts", "reviewPeriods", "tasks"]),
        effortPerTaskForSelectedReview(): Map<number, Array<Effort>> {
            let effortPerTask = new Map<number, Array<Effort>>()
            // Ensure there is at least an empty array for each task id.
            for (const task of this.plannedTasks) {
                if (!effortPerTask.has(task.id)) {
                    effortPerTask.set(task.id, new Array<Effort>())
                }
            }

            if (this.selectedReviewBundle === undefined) {
                return effortPerTask
            }

            for (const effort of this.efforts.values() as Array<Effort>) {
                if (effort.interval.intersection(this.selectedReviewBundle.interval) !== null) {
                    effortPerTask.get(effort.taskId)?.push(effort)
                }
            }
            return effortPerTask
        },
        reviewPeriodsForConfiguration(): Array<Review> {
            return [...this.reviewPeriods.values()].filter(
                (reviewPeriod: Review) => reviewPeriod.configurationId == this.configuration.id)
        },
        plannedTasks(): Array<Task> {
            let plannedTasks: Array<Task> = []
            if (this.selectedReviewBundle === undefined) {
                return plannedTasks
            }
            for (const id of this.selectedReviewBundle.review.plannedTasksIds) {
                plannedTasks.push(this.tasks.get(id))
            }
            return plannedTasks
        },
        previousButtonDisabled(): boolean { 
            return this.selectedReviewIndex == 0 },
        nextButtonDisabled(): boolean { 
            return this.selectedReviewIndex == Math.max(0, this.reviewPeriodsForConfiguration.length - 1)},
        selectedReviewBundle(): ReviewBundle | undefined {
            if (this.reviewPeriodsForConfiguration.length === 0) {
                return undefined
            }
            const review = this.reviewPeriodsForConfiguration[this.selectedReviewIndex]
            return { review,
                     interval: this.configuration.getInterval(review.index),
                     reviewName: this.configuration.getName(review.index) } 
        },
    },

    methods: {
        ...mapActions(["fetchEfforts"]),
        changeSelectedReviewIndexBy(step: number) {
            this.selectedReviewIndex = Math.max(Math.min(this.selectedReviewIndex + step,
                                                         this.reviewPeriodsForConfiguration.length - 1), 0)
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
    width: calc(100% - #{2 * $margin})
    max-width: constants.$card-max-width
    background-color: constants.$colour-background
</style>