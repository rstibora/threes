<template>
  <compact-header :has-back-button="true">
    {{ configuration.getReviewName(review.index) }}
    <template #subheader>
      <p>{{ reviewIntervalString }}</p>
    </template>
  </compact-header>

  <div class="card">
    <h2>Task Effort</h2>

    <!-- <stacked-area-chart :configuration="chartConfiguration"/> -->
    <pie-chart :configuration="pieChartConfiguration" />

    <div class="chart" />

    <div v-if="tasksStore.plannedTasks(review).size > 0">
      <p>Tracked</p>
      <task-pill
        v-for="task of tasksStore.plannedTasks(review).values()"
        :key="task.id"
        :task="task"
        :efforts="effortsPerTask(task, configuration.getReviewInterval(review.index))"
        :configuration="{ listEfforts: true }"
      />
    </div>
    <p v-else>
      No tasks tracked yet.
    </p>
    <button
      class="button-track-tasks"
      @click="buttonTrackTasksHandler"
    >
      Select tasks to track
    </button>
    <div v-if="tasksStore.tasksAndEffortsForInterval(configuration.getReviewInterval(review.index), tasksStore.plannedTasks(review)).length > 0">
      <p>Untracked</p>
      <task-pill
        v-for="[task, efforts] of tasksStore.tasksAndEffortsForInterval(configuration.getReviewInterval(review.index), tasksStore.plannedTasks(review))"
        :key="task.id"
        :task="task" 
        :efforts="efforts"
      />
    </div>
  </div>
</template>

<script lang="ts">
import * as d3 from "d3"
import { defineComponent, PropType } from "vue"

import CompactHeader from "src/components/buildingBlocks/CompactHeader.vue"
import TaskPill from "src/components/tasks/TaskPill.vue"
import { StackedAreaChartConfiguration, Stack } from "src/components/buildingBlocks/visualization/stackedAreaChart"
import PieChart from "src/components/buildingBlocks/visualization/PieChart.vue"
import { PieArea, PieChartConfiguration } from "src/components/buildingBlocks/visualization/PieChart"

import { Review, NewReview, ReviewIdentification } from "src/network/models/review"
import { ReviewConfiguration } from "src/network/models/reviewConfiguration"
import { Task } from "src/network/models/task"
import { useReviewConfigurationsStore } from "src/state/reviewConfigurationsStore"
import { useReviewsStore } from "src/state/reviewsStore"
import { RouteNames } from "src/routing/routeNames"
import { useTasksStore } from "src/state/tasksStore"
import { displayIntervalEnd } from "src/utils/dateTime"


export default defineComponent({
  components: {
    CompactHeader,
    PieChart,
    TaskPill,
  },
  props: {
    reviewIdentification: {
      type: Object as PropType<ReviewIdentification>,
      required: true,
    },
  },
  setup(props) {
    const reviewsStore = useReviewsStore()
    const reviewConfigurationsStore = useReviewConfigurationsStore()
    const tasksStore = useTasksStore()
    return { reviewsStore, reviewConfigurationsStore, tasksStore }
  },
  data: function() {
    return {
      reviewId: this.reviewIdentification.id
    }
  },
  computed: {
    configuration(): ReviewConfiguration {
      return this.reviewConfigurationsStore.configurations.get(this.review.configurationId) as ReviewConfiguration
    },
    review(): Review | NewReview {
      if (this.reviewId !== undefined) {
        return this.reviewsStore.reviews.get(this.reviewId) as Review
      }
      return new NewReview(this.reviewIdentification.configurationId as number, this.reviewIdentification.index as number, [])
    },
    reviewIntervalString(): string {
      const start = this.configuration.getReviewInterval(this.review.index).start
      const end = displayIntervalEnd(this.configuration.getReviewInterval(this.review.index).end)
      return `${start.toLocaleString()} - ${end.toLocaleString()}`
    },
    pieChartConfiguration(): PieChartConfiguration {
      const totalEffortPerTask: Array<[Task, number]> = []
      for (const [task, efforts] of this.tasksStore.tasksAndEffortsForInterval(this.configuration.getReviewInterval(this.review.index))) {
        let totalEffort = 0
        for (const effort of efforts.values()) {
          totalEffort += effort.duration
        }
        totalEffortPerTask.push([task, totalEffort])
      }
      totalEffortPerTask.sort((a, b) => a[1] - b[1]).reverse()
      const areas: Array<PieArea> = []
      for (const [task, totalEffort] of totalEffortPerTask) {
        areas.push({ name: task.name, value: totalEffort, colour: d3.schemePastel1[task.id % 9]})
      }
      return { areas }
    },
    chartConfiguration(): StackedAreaChartConfiguration {
      const dataPointsCount = 8
      const reviewIndices = Array.from(Array(dataPointsCount), (_, i) => this.review.index - i)
      const perTaskPerReviewEffort = new Map<number, Map<number, number>>()
      for (const reviewIndex of reviewIndices) {
        const reviewInterval = this.configuration.getReviewInterval(reviewIndex)
        const tasksAndEffortsForInterval = this.tasksStore.tasksAndEffortsForInterval(reviewInterval)

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
                name: (this.tasksStore.getExistingTask(taskId)).name })
      }
      return new StackedAreaChartConfiguration(stacks)
    }
  },
  methods: {
    async buttonTrackTasksHandler() {
      // Create the review if it doesn't exist.
      if (this.reviewIdentification.id === undefined) {
        const createdReview = await this.reviewsStore.createReview(this.review)
        this.reviewId = createdReview.id
        this.$router.replace({ name: RouteNames.REVIEW, params: { reviewId: createdReview.id }})
      }
      this.$router.push({ name: RouteNames.TASKS, query: { action: "selectForReview", reviewId: (this.review as Review).id }})
    },
  },
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
