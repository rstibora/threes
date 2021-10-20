<template>
<div class="card">
    <h1>{{ configuration.getReviewName(review.index) }}</h1>
    <p>{{ configuration.getReviewInterval(review.index).start.toLocaleString() }} - {{ configuration.getReviewInterval(review.index).end.toLocaleString() }}</p>

    <h2>Task Effort</h2>

    <stacked-area-chart :configuration="chartConfiguration"/>

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
import StackedAreaChart from "src/components/utility/StackedAreaChart.vue"
import { StackedAreaChartConfiguration, Stack } from "src/components/utility/stackedAreaChart"

import { Effort } from "src/network/models/effort"
import { Review, NewReview, ReviewIdentification } from "src/network/models/review"
import { ReviewConfiguration } from "src/network/models/reviewConfiguration"
import { Task } from "src/network/models/task"

import { TaskAndEfforts } from "src/state/store"
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
        chartConfiguration(): StackedAreaChartConfiguration {
            const dataPointsCount = 8
            const reviewIndices = Array.from(Array(dataPointsCount), (_, i) => this.review.index - i)
            const perTaskPerReviewEffort = new Map<number, Map<number, number>>()
            for (const reviewIndex of reviewIndices) {
                const reviewInterval = this.configuration.getReviewInterval(reviewIndex)
                const tasksAndEffortsForInterval: TaskAndEfforts = this.tasksAndEffortsForInterval(reviewInterval)

                for (const [task, efforts] of tasksAndEffortsForInterval) {
                    let taskEffort = 0
                    for (const effort of efforts.values()) {
                        taskEffort += effort.duration
                    }
                    if (!perTaskPerReviewEffort.has(task.id)) {
                        perTaskPerReviewEffort.set(task.id, new Map<number, number>(reviewIndices.map(index => [index, 0])))
                    }
                    (perTaskPerReviewEffort.get(task.id) as Map<number, number>).set(reviewIndex, taskEffort)
                }
            }

            const stacks = new Array<Stack>()
            for (const [taskId, efforts] of perTaskPerReviewEffort) {
                const singleStackData = new Array<number>()
                for (const reviewIndex of [...efforts.keys()].sort()) {
                    singleStackData.push(efforts.get(reviewIndex) as number)
                }
                stacks.push({ data: singleStackData,
                              color: "lightsteelblue",
                              name: (this.$store.state.tasks.tasks.get(taskId) as Task).name })
            }
            return new StackedAreaChartConfiguration(stacks)
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
        StackedAreaChart,
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
