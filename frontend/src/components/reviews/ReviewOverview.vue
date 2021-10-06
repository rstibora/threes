<template>
<div class="card">
    <h1>{{ configuration.getReviewName(review.index) }}</h1>
    <p>{{ configuration.getReviewInterval(review.index).start.toLocaleString() }} - {{ configuration.getReviewInterval(review.index).end.toLocaleString() }}</p>

    <h2>Task Effort</h2>

    <line-chart :data="totalReviewEffortChartData"/>

    <div class="chart">
    </div>

    <div v-if="plannedTasks(review).size > 0">
        <p>Tracked</p>
        <task-pill v-for="task of plannedTasks(review).values()" :key="task.id"
                   :task="task" :efforts="effortsPerTask(task, configuration.getReviewInterval(review.index))"
                   :configuration="{ listEfforts: true }"/>
    </div>
    <p v-else>No tasks tracked yet.</p>
    <button class="button-track-tasks" @click="buttonTrackTasksHandler">Select tasks to track</button>
    <div v-if="tasksAndEffortsForInterval(configuration.getReviewInterval(review.index), plannedTasks(review)).length > 0">
        <p>Untracked</p>
        <task-pill v-for="[task, efforts] of tasksAndEffortsForInterval(configuration.getReviewInterval(review.index), plannedTasks(review))"
                   :key="task.id" :task="task" :efforts="efforts"/>
    </div>
</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"
import { mapGetters } from "vuex"

import { MapById } from "src/utils/types"

import TaskPill from "src/components/tasks/TaskPill.vue"
import LineChart from "src/components/utility/LineChart.vue"

import { Effort } from "src/network/models/effort"
import { Review, NewReview, ReviewIdentification } from "src/network/models/review"
import { ReviewConfiguration } from "src/network/models/reviewConfiguration"
import { Task } from "src/network/models/task"

import { Actions } from "src/state/storeAccess"


export default defineComponent({
    props: {
        reviewIdentification: {
            type: Object as PropType<ReviewIdentification>,
            required: true,
        },
    },
    computed: {
        ...mapGetters(["plannedTasks", "effortsPerTask", "tasksAndEffortsForInterval"]),
        configuration(): ReviewConfiguration {
            return this.$store.state.reviews.configurations.get(this.review.configurationId) as ReviewConfiguration
        },
        review(): Review | NewReview {
            if (this.reviewId !== undefined) {
                return this.$store.state.reviews.reviews.get(this.reviewId) as Review
            }
            return new NewReview(this.reviewIdentification.configurationId as number, this.reviewIdentification.index as number, [])
        },
        totalReviewEffortChartData(): Array<[number, number]> {
            const dataPointsCount = 8
            let totalEffortPerReview = new Array<number>()
            for (let reviewIndex = this.review.index; reviewIndex > this.review.index - dataPointsCount; reviewIndex--) {
                totalEffortPerReview.push(0)
                const taskAndEfforts: Array<[Task, MapById<Effort>]> = this.tasksAndEffortsForInterval(
                    this.configuration.getReviewInterval(reviewIndex))
                for (const [_, efforts] of taskAndEfforts) {
                    for (const [_, effort] of efforts) {
                        totalEffortPerReview[totalEffortPerReview.length - 1] += effort.duration
                    }
                }
            }
            let output = new Array<[number, number]>()
            for (let idx = 0; idx < totalEffortPerReview.length; idx++) {
                // Chart displays the data according the x coordinate, not array index, and we
                // want to have the most recent review period at the end of the chart.
                output.push([idx, totalEffortPerReview[totalEffortPerReview.length - (idx + 1)]])
            }
            // Reverse so that the array ordering is aligned with the chart (this reverse
            // does not affect the chart).
            return output.reverse()
        }
    },
    data: function() {
        return {
            reviewId: this.reviewIdentification.id
        }
    },
    methods: {
        async buttonTrackTasksHandler() {
            // Create the review if it doesn't exist.
            if (this.reviewIdentification.id === undefined) {
                const createdReview: Review = await this.$store.dispatch(Actions.CREATE_REVIEW, { review: this.review as NewReview })
                this.reviewId = createdReview.id
                this.$router.replace({ name: "review", params: { reviewId: createdReview.id }})
            }
            this.$router.push({ name: "tasks", query: { action: "selectForReview", reviewId: (this.review as Review).id }})
        },
    },
    components: {
        LineChart,
        TaskPill,
    }
})
</script>

<style lang="sass" scoped>
@use "src/styles/constants"
@use "src/styles/visual"

$margin: constants.$margin-small

.card
    @include visual.rounded
    margin: $margin
    padding: .5em
    background-color: constants.$colour-background
</style>
