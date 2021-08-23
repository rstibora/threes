<template>
<div class="card">
    <h1>{{ configuration.getReviewName(reviewIndex) }}</h1>
    <p>{{ configuration.getReviewInterval(reviewIndex).start.toLocaleString() }} - {{ configuration.getReviewInterval(reviewIndex).end.toLocaleString() }}</p>

    <task-pill v-for="task of plannedTasks.values()" :key="task.id" :task="task" :efforts="[]"/>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { mapState } from "vuex"

import TaskPill from "src/components/tasks/TaskPill.vue"

import { filterTasks } from "src/components/reviews/reviewUtils"

import { Review, NewReview } from "src/network/models/review"
import { ReviewConfiguration } from "src/network/models/reviewConfiguration"
import { Task } from "src/network/models/task"

import { MapById } from "src/state/store"


export default defineComponent({
    props: {
        configurationId: {
            type: Number,
            required: true,
        },
        reviewIndex: {
            type: Number,
            required: true,
        },
        reviewId : {
            type: Number
        },
    },
    computed: {
        ...mapState(["reviews", "reviewConfigurations", "tasks"]),
        configuration(): ReviewConfiguration {
            return this.reviewConfigurations.get(this.configurationId) as ReviewConfiguration
        },
        plannedTasks(): MapById<Task> {
            return filterTasks(this.tasks, this.configuration, this.review).planned
        },
    },
    data: function() {
        return {
            review: new NewReview(this.configurationId, this.reviewIndex, []) as Review | NewReview,
        }
    },
    components: {
        TaskPill,
    },
    created: function() {
        if (this.reviewId !== undefined) {
            this.review = this.reviews.get(this.reviewId) as Review
        }
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
